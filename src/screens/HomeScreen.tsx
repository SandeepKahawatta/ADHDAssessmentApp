import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, SIZES } from '../constants/theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [childId, setChildId] = useState('');

    const validateAndNavigate = (
        screen: 'Questionnaire' | 'Game' | 'Result',
        params?: any
    ) => {
        if (!childId.trim()) {
            Alert.alert('Required', 'Please enter a Child ID to proceed.');
            return;
        }
        navigation.navigate(screen as any, { childId, ...params });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>ADHD Assessment</Text>
                    <Text style={styles.subtitle}>
                        Complete assessments to help diagnosis.
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Child ID"
                        placeholder="Enter unique child identifier"
                        value={childId}
                        onChangeText={setChildId}
                        autoCapitalize="none"
                    />

                    <Text style={styles.sectionTitle}>Assessments</Text>

                    <Button
                        title="Parent Questionnaire"
                        onPress={() => validateAndNavigate('Questionnaire', { source: 'parent' })}
                        style={styles.button}
                    />

                    <Button
                        title="Teacher Questionnaire"
                        onPress={() => validateAndNavigate('Questionnaire', { source: 'teacher' })}
                        style={styles.button}
                        variant="secondary"
                    />

                    <Text style={styles.sectionTitle}>Performance Task</Text>

                    <Button
                        title="Start Reaction Game"
                        onPress={() => validateAndNavigate('Game')}
                        style={styles.button}
                        variant="outline"
                    />

                    <View style={styles.divider} />

                    <Button
                        title="View Final Results"
                        onPress={() => validateAndNavigate('Result')}
                        style={styles.button}
                        variant="primary"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.l,
    },
    header: {
        marginBottom: SPACING.xl,
        marginTop: SPACING.l,
    },
    title: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: SIZES.body,
        color: COLORS.textSecondary,
    },
    form: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: SIZES.radius,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: SIZES.h3,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.m,
        marginBottom: SPACING.s,
    },
    button: {
        marginBottom: SPACING.s,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: SPACING.l,
    },
});

export default HomeScreen;
