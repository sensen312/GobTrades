import React from 'react';
import {
  FormControl, FormControlLabel, FormControlError, FormControlErrorIcon,
  FormControlErrorText, Textarea, TextareaInput, AlertCircleIcon, Box
} from '@gluestack-ui/themed';
import { Controller, Control } from 'react-hook-form';
import ThemedText from './ThemedText';
import type { ComponentProps } from 'react'; // Import ComponentProps

// Get Textarea props type using ComponentProps
type TextareaProps = ComponentProps<typeof Textarea>;
// Get TextareaInput props type
type TextareaInputProps = ComponentProps<typeof TextareaInput>;

// Combine base Textarea props with RHF props and custom ones
interface StyledTextareaProps extends Omit<TextareaProps, 'onChange' | 'onBlur' | 'value'> {
  name: string;
  label: string;
  control: Control<any>;
  rules?: object;
  placeholder: string;
  isRequired?: boolean;
  maxLength?: number;
  // Allow passing TextareaInput props like numberOfLines via inputProps
  inputProps?: Omit<TextareaInputProps, 'value' | 'onChangeText' | 'onBlur' | 'maxLength'>;
}

const StyledTextarea: React.FC<StyledTextareaProps> = ({
  name, label, control, rules, placeholder, isRequired, maxLength, inputProps, ...textareaProps // Spread remaining TextareaProps
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value = '' }, fieldState: { error } }) => (
        <FormControl isRequired={isRequired} isInvalid={!!error} mb="$4">
          <FormControlLabel mb="$1">
            <ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText>
          </FormControlLabel>
          {/* Ensure variant="outline" is passed and handled by theme */}
          <Textarea
            size="md"
            isInvalid={!!error}
            isDisabled={textareaProps.isDisabled} // Correct prop name is isDisabled
            // Apply outline variant styles directly via sx
            sx={{
                bg: '$inputBackground',
                borderWidth: 1,
                borderColor: error ? '$errorBase' : '$inputBorder', // Use errorBase directly
                borderRadius: '$sm',
                _input: {
                   color: '$textPrimary',
                   fontFamily: '$body',
                   placeholderTextColor: '$inputPlaceholder',
                   fontSize: '$md',
                   p: '$3',
                   textAlignVertical: 'top'
                },
                ':hover': { borderColor: error ? '$errorBase' : '$woodBrown600' },
                ':focus': { borderColor: error ? '$errorBase' : '$goblinGreen500' },
                ':disabled': { opacity: 0.5, bg: '$parchment200' },
            }}
          >
            <TextareaInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              maxLength={maxLength}
              textAlignVertical="top"
              {...inputProps}
            />
          </Textarea>
          <Box flexDirection="row" justifyContent="space-between" mt="$1" minHeight={18}>
            {error ? ( <FormControlError> <FormControlErrorIcon as={AlertCircleIcon} size="sm" /> <FormControlErrorText size="sm">{error.message}</FormControlErrorText> </FormControlError> ) : <Box />}
            {maxLength && ( <ThemedText size="xs" color="$textSecondary"> {value?.length || 0} / {maxLength} </ThemedText> )}
          </Box>
        </FormControl>
      )}
    />
  );
};
export default StyledTextarea;
