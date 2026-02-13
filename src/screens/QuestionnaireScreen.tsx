import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { submitQuestionnaire } from '../api/endpoints';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS, SPACING, SIZES } from '../constants/theme';

type Props = StackScreenProps<RootStackParamList, 'Questionnaire'>;

const QUESTIONS = [
    "1. Often fails to give close attention to details or makes careless mistakes.",
    "2. Often has difficulty sustaining attention in tasks or play activities.",
    "3. Often does not seem to listen when spoken to directly.",
    "4. Often does not follow through on instructions and fails to finish duties.",
    "5. Often has difficulty organizing tasks and activities.",
    "6. Often avoids, dislikes, or is reluctant to engage in tasks requiring mental effort.",
    "7. Often loses things necessary for tasks or activities.",
    "8. Often is easily distracted by extraneous stimuli.",
    "9. Often is forgetful in daily activities.",
    "10. Often fidgets with or taps hands or feet or squirms in seat.",
    "11. Often leaves seat in situations when remaining seated is expected.",
    "12. Often runs about or climbs in situations where it is inappropriate.",
    "13. Often unable to play or engage in leisure activities quietly.",
    "14. Is often 'on the go', acting as if 'driven by a motor'.",
    "15. Often talks excessively.",
    "16. Often blurts out an answer before a question has been completed.",
    "17. Often has difficulty waiting his or her turn.",
    "18. Often interrupts or intrudes on others."
];

const OPTIONS = [
    { label: 'Never', value: 0 },
    { label: 'Rarely', value: 1 },
    { label: 'Often', value: 2 },
    { label: 'Very Often', value: 3 },
];

const QuestionnaireScreen: React.FC<Props> = ({ navigation, route }) => {
    const { childId, source } = route.params;
    const [answers, setAnswers] = useState<number[]>(new Array(18).fill(-1));
    const [loading, setLoading] = useState(false);

    const handleSelect = (questionIndex: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (answers.includes(-1)) {
            Alert.alert('Incomplete', 'Please answer all questions before submitting.');
            return;
        }

        setLoading(true);
        try {
            const response = await submitQuestionnaire({
                child_id: childId,
                source,
                responses: answers,
            });

            Alert.alert(
                'Success',
                `Score: ${response.result.score.toFixed(1)}% - ${response.result.type}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerText}>
                {source === 'parent' ? 'Parent' : 'Teacher'} Assessment for {childId}
            </Text>

            {QUESTIONS.map((q, index) => (
                <Card key={index}>
                    <Text style={styles.questionText}>{q}</Text>
                    <View style={styles.optionsContainer}>
                        {OPTIONS.map((opt) => (
                            <Button
                                key={opt.value}
                                title={opt.label}
                                onPress={() => handleSelect(index, opt.value)}
                                variant={answers[index] === opt.value ? 'primary' : 'outline'}
                                style={styles.optionButton}
                                textStyle={{ fontSize: 12 }}
                            />
                        ))}
                    </View>
                </Card>
            ))}

            <Button
                title="Submit Assessment"
                onPress={handleSubmit}
                isLoading={loading}
                style={styles.submitButton}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.m,
    },
    headerText: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.m,
        textAlign: 'center',
    },
    questionText: {
        fontSize: SIZES.body,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    optionButton: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.s,
        marginBottom: SPACING.xs,
        minWidth: '48%',
    },
    submitButton: {
        marginTop: SPACING.m,
        marginBottom: SPACING.xl,
    },
});

export default QuestionnaireScreen;
