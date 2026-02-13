import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getFinalResult } from '../api/endpoints';
import { FinalResultResponse, PendingResultResponse } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS, SPACING, SIZES } from '../constants/theme';

type Props = StackScreenProps<RootStackParamList, 'Result'>;

const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
    const { childId } = route.params;
    const [data, setData] = useState<FinalResultResponse | PendingResultResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, []);

    const fetchResult = async () => {
        try {
            const result = await getFinalResult(childId);
            setData(result);
        } catch (error) {
            // Display handled in api/endpoints (console.error)
            // Could add retry logic here
        } finally {
            setLoading(false);
        }
    };

    const isPending = (data: any): data is PendingResultResponse => {
        return data && data.status === 'pending';
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Analyzing Assessment Data...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.center}>
                <Text>Failed to load results.</Text>
                <Button title="Retry" onPress={fetchResult} />
            </View>
        );
    }

    if (isPending(data)) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.title}>Assessment Incomplete</Text>
                <Text style={styles.message}>{data.message}</Text>
                <Text style={styles.subtitle}>Completed Steps:</Text>
                {data.completed_steps.map((step, index) => (
                    <Text key={index} style={styles.listItem}>• {step}</Text>
                ))}
                <Button
                    title="Go Back"
                    onPress={() => navigation.goBack()}
                    style={styles.marginTop}
                />
            </View>
        );
    }

    // Final Diagnosis
    const diagnosis = (data as FinalResultResponse).final_diagnosis;
    const confirmed = diagnosis.status.includes('Confirmed');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card style={confirmed ? styles.confirmedCard : styles.infoCard}>
                <Text style={styles.statusLabel}>Diagnosis Status</Text>
                <Text style={[styles.statusValue, confirmed && styles.confirmedText]}>
                    {diagnosis.status}
                </Text>
            </Card>

            <Card>
                <Text style={styles.sectionHeader}>Analysis Report</Text>
                <Text style={styles.messageText}>{diagnosis.message}</Text>
            </Card>

            <Card>
                <Text style={styles.sectionHeader}>Detailed Breakdown</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Parent Observation:</Text>
                    <Text style={styles.value}>{diagnosis.breakdown.parent_observation}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Teacher Observation:</Text>
                    <Text style={styles.value}>{diagnosis.breakdown.teacher_observation}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Objective Game:</Text>
                    <Text style={styles.value}>{diagnosis.breakdown.objective_result}</Text>
                </View>
            </Card>

            <Card style={styles.actionCard}>
                <Text style={styles.actionLabel}>Recommendation</Text>
                <Text style={styles.actionValue}>{(data as FinalResultResponse).next_step}</Text>
            </Card>

            <Button
                title="Start New Assessment"
                onPress={() => navigation.popToTop()}
                style={styles.marginTop}
                variant="outline"
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    loadingText: {
        marginTop: SPACING.m,
        color: COLORS.textSecondary,
    },
    title: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.m,
        textAlign: 'center',
    },
    message: {
        fontSize: SIZES.body,
        textAlign: 'center',
        marginBottom: SPACING.l,
        color: COLORS.text,
    },
    subtitle: {
        fontSize: SIZES.h3,
        fontWeight: '600',
        marginBottom: SPACING.s,
    },
    listItem: {
        fontSize: SIZES.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    marginTop: {
        marginTop: SPACING.xl,
    },
    confirmedCard: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.error,
    },
    infoCard: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.secondary,
    },
    statusLabel: {
        fontSize: SIZES.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    statusValue: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    confirmedText: {
        color: COLORS.error,
    },
    sectionHeader: {
        fontSize: SIZES.h3,
        fontWeight: '600',
        marginBottom: SPACING.m,
        color: COLORS.text,
    },
    messageText: {
        fontSize: SIZES.body,
        color: COLORS.text,
        lineHeight: 22,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
        paddingBottom: SPACING.s,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    label: {
        fontWeight: '500',
        color: COLORS.textSecondary,
    },
    value: {
        fontWeight: '600',
        color: COLORS.primary,
    },
    actionCard: {
        backgroundColor: '#ECFDF5', // Light green
    },
    actionLabel: {
        fontSize: SIZES.body,
        color: '#065F46',
        marginBottom: SPACING.xs,
    },
    actionValue: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: '#064E3B',
    },
});

export default ResultScreen;
