import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { submitGameData } from '../api/endpoints';
import { COLORS, SPACING, SIZES } from '../constants/theme';

type Props = StackScreenProps<RootStackParamList, 'Game'>;

const { width } = Dimensions.get('window');
const TOTAL_TRIALS = 5;

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
    const { childId } = route.params;
    const [gameState, setGameState] = useState<'idle' | 'waiting' | 'active' | 'finished'>('idle');
    const [trial, setTrial] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [errors, setErrors] = useState(0); // Impulsive taps

    const startTimeRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const startGame = () => {
        setGameState('waiting');
        setTrial(1);
        setReactionTimes([]);
        setErrors(0);
        scheduleStimulus();
    };

    const scheduleStimulus = () => {
        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
        timeoutRef.current = setTimeout(() => {
            setGameState('active');
            startTimeRef.current = Date.now();
        }, randomDelay);
    };

    const handleTap = () => {
        if (gameState === 'waiting') {
            // Impulsive tap
            setErrors((prev) => prev + 1);
            Alert.alert('Too Early!', 'Wait for the green circle.', [
                {
                    text: 'OK', onPress: () => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        scheduleStimulus();
                    }
                }
            ]);
            return;
        }

        if (gameState === 'active') {
            const reactionTime = Date.now() - startTimeRef.current;
            const newReactionTimes = [...reactionTimes, reactionTime];
            setReactionTimes(newReactionTimes);
            setGameState('waiting');

            if (newReactionTimes.length >= TOTAL_TRIALS) {
                finishGame(newReactionTimes);
            } else {
                setTrial((prev) => prev + 1);
                scheduleStimulus();
            }
        }
    };

    const calculateStdDev = (arr: number[], mean: number) => {
        const squareDiffs = arr.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / arr.length;
        return Math.sqrt(avgSquareDiff);
    };

    const finishGame = async (times: number[]) => {
        setGameState('finished');

        // Calculate metrics
        const avgReactionTime = times.reduce((a, b) => a + b, 0) / times.length;
        const stdDev = calculateStdDev(times, avgReactionTime);
        const accuracy = 1.0; // Assuming valid taps are correct
        const impulsivity = errors / (TOTAL_TRIALS + errors);
        const focusConsistency = 1000 / (stdDev + 1); // Inverse of variability
        const completions = 1.0;

        try {
            const response = await submitGameData({
                child_id: childId,
                avg_reaction_time: avgReactionTime,
                reaction_time_std: stdDev,
                accuracy_rate: accuracy,
                impulsivity_error_rate: impulsivity,
                focus_consistency_score: focusConsistency,
                task_completion_ratio: completions,
            });

            Alert.alert(
                'Assessment Complete',
                `Score: ${response.objective_result.score.toFixed(1)} / 100`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit game data.');
        }
    };

    return (
        <View style={styles.container}>
            {gameState === 'idle' ? (
                <View style={styles.center}>
                    <Text style={styles.instructions}>
                        Tap the circle as fast as you can when it turns GREEN.
                    </Text>
                    <TouchableOpacity style={styles.startButton} onPress={startGame}>
                        <Text style={styles.startText}>Start Game</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.gameArea}
                    onPress={handleTap}
                >
                    {gameState !== 'finished' && (
                        <View style={[
                            styles.stimulus,
                            gameState === 'active' ? styles.activeStimulus : styles.waitingStimulus
                        ]}>
                            <Text style={styles.stimulusText}>
                                {gameState === 'active' ? 'TAP!' : 'WAIT...'}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.stats}>Trial: {trial} / {TOTAL_TRIALS}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    instructions: {
        fontSize: SIZES.h2,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        color: COLORS.text,
    },
    startButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: SIZES.radius,
    },
    startText: {
        color: COLORS.surface,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stimulus: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    waitingStimulus: {
        backgroundColor: '#E5E7EB', // Gray
    },
    activeStimulus: {
        backgroundColor: '#10B981', // Green
    },
    stimulusText: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    stats: {
        position: 'absolute',
        bottom: SPACING.xl,
        fontSize: SIZES.h3,
        color: COLORS.textSecondary,
    },
});

export default GameScreen;
