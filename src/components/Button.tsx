import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, SIZES } from '../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    isLoading = false,
    variant = 'primary',
    style,
    textStyle,
    disabled = false,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return COLORS.textSecondary;
        switch (variant) {
            case 'secondary':
                return COLORS.secondary;
            case 'outline':
                return 'transparent';
            default:
                return COLORS.primary;
        }
    };

    const getTextColor = () => {
        if (variant === 'outline') return COLORS.primary;
        return COLORS.surface;
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outline,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    outline: {
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    text: {
        fontSize: SIZES.h3,
        fontWeight: '600',
    },
});

export default Button;
