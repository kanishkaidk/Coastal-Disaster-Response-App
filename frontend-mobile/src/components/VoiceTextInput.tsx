import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceInputButton from './VoiceInputButton';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

interface VoiceTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  multiline?: boolean;
  numberOfLines?: number;
  label?: string;
  disabled?: boolean;
  showVoiceButton?: boolean;
  voiceButtonPosition?: 'inside' | 'right';
  language?: string;
  style?: any;
}

const VoiceTextInput: React.FC<VoiceTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = colors.gray400,
  multiline = false,
  numberOfLines = 1,
  label,
  disabled = false,
  showVoiceButton = true,
  voiceButtonPosition = 'right',
  language = 'en-US',
  style,
}) => {
  const handleVoiceResult = (text: string) => {
    onChangeText(text);
  };

  const renderVoiceButton = () => {
    if (!showVoiceButton) return null;
    const voiceButtonStyle = voiceButtonPosition === 'inside'
      ? styles.voiceButtonInside
      : styles.voiceButtonRight;
    return (
      <VoiceInputButton
        onVoiceResult={handleVoiceResult}
        disabled={disabled}
        size="small"
        style={voiceButtonStyle}
        language={language}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        disabled && styles.inputContainerDisabled,
        multiline && styles.inputContainerMultiline,
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            disabled && styles.inputDisabled,
            voiceButtonPosition === 'right' && showVoiceButton && styles.inputWithVoiceButton,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {renderVoiceButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    minHeight: 80,
  },
  inputContainerDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.gray200,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.onBackground,
    paddingVertical: spacing.sm,
    textAlignVertical: 'center',
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: colors.gray500,
  },
  inputWithVoiceButton: {
    paddingRight: spacing.sm,
  },
  voiceButtonInside: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
  voiceButtonRight: {
    marginLeft: spacing.sm,
  },
});

export default VoiceTextInput;