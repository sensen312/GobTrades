// src/components/StyledTextarea.tsx
import React from 'react';
import {
  FormControl, FormControlLabel, FormControlError, FormControlErrorIcon,
  FormControlErrorText, Textarea, TextareaInput, AlertCircleIcon, Box
} from '@gluestack-ui/themed';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import ThemedText from './ThemedText';
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type TextareaPropsStyled = ComponentProps<typeof Textarea>;
type TextareaInputPropsStyled = ComponentProps<typeof TextareaInput>;
type FormControlPropsStyledTextarea = ComponentProps<typeof FormControl>;

interface StyledTextareaProps<TFieldValues extends FieldValues> extends Omit<TextareaPropsStyled, 'onChange' | 'onBlur' | 'value'> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  rules?: Omit<RegisterOptions<TFieldValues, Path<TFieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  placeholder: string;
  isRequired?: boolean;
  maxLength?: number;
  inputProps?: Omit<TextareaInputPropsStyled, 'value' | 'onChangeText' | 'onBlur' | 'maxLength'>;
  formControlProps?: Partial<FormControlPropsStyledTextarea>;
}

const StyledTextarea = <TFieldValues extends FieldValues>({
  name, label, control, rules, placeholder, isRequired, maxLength, inputProps, formControlProps, ...textareaContainerProps
}: StyledTextareaProps<TFieldValues>) => {
  // Reasoning: Standardizes multi-line text input fields, integrating react-hook-form
  // and applying consistent theming. Includes character count display.
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value = '' }, fieldState: { error } }) => (
        <FormControl
            isRequired={isRequired}
            isInvalid={!!error}
            mb="$4"
            isDisabled={textareaContainerProps.isDisabled}
            {...formControlProps}
            testID={`form-control-textarea-${name}`}
        >
          <FormControlLabel mb="$1">
            <ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText>
          </FormControlLabel>
          <Textarea
            size="md" // Consistent sizing
            isInvalid={!!error}
            isDisabled={textareaContainerProps.isDisabled}
            // Applying outline variant styles directly via sx as per theme structure
            sx={{
                bg: '$inputBackground',
                borderWidth: 1,
                borderColor: error ? '$errorBase' : '$inputBorder',
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
                ':focus': { borderColor: error ? '$errorBase' : '$goblinGreen500', borderWidth: 2 },
                ':disabled': { opacity: 0.5, bg: '$parchment200' },
            }}
            {...textareaContainerProps}
          >
            <TextareaInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              maxLength={maxLength}
              textAlignVertical="top" // Ensures text starts from top
              {...inputProps} // Spread other TextareaInput specific props
            />
          </Textarea>
          <Box flexDirection="row" justifyContent="space-between" mt="$1" minHeight={18}>
            {error ? (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
                <FormControlErrorText size="sm">{error.message}</FormControlErrorText>
              </FormControlError>
            ) : <Box /> /* Placeholder for spacing if no error */}
            {maxLength && (
              <ThemedText size="xs" color="$textSecondary">
                {value?.length || 0} / {maxLength}
              </ThemedText>
            )}
          </Box>
        </FormControl>
      )}
    />
  );
};
export default StyledTextarea;
