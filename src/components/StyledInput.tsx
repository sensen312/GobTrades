// src/components/StyledInput.tsx
import React from 'react';
import {
  FormControl, FormControlLabel, FormControlError, FormControlErrorIcon,
  FormControlErrorText, Input, InputField, AlertCircleIcon
} from '@gluestack-ui/themed';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import ThemedText from './ThemedText';
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type InputPropsStyled = ComponentProps<typeof Input>;
type InputFieldPropsStyled = ComponentProps<typeof InputField>;
type FormControlPropsStyled = ComponentProps<typeof FormControl>;
// type FormControlLabelPropsStyled = ComponentProps<typeof FormControlLabel>; // Not directly spread
// type FormControlErrorPropsStyled = ComponentProps<typeof FormControlError>; // Not directly spread


interface StyledInputProps<TFieldValues extends FieldValues> extends Omit<InputPropsStyled, 'onChange' | 'onBlur' | 'value'> {
  name: Path<TFieldValues>; // Typed name based on form values
  label: string;
  control: Control<TFieldValues>;
  rules?: Omit<RegisterOptions<TFieldValues, Path<TFieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  isRequired?: boolean;
  placeholder?: string;
  inputFieldProps?: Partial<InputFieldPropsStyled>; // Allow passing specific props to InputField
  // Allow passing props to FormControl
  formControlProps?: Partial<FormControlPropsStyled>;
}

/** Renders themed input field integrated with react-hook-form. */
// Generic type TFieldValues for react-hook-form
const StyledInput = <TFieldValues extends FieldValues>({
  name, label, control, rules, placeholder, isRequired, inputFieldProps, formControlProps, ...inputContainerProps
}: StyledInputProps<TFieldValues>) => {
  // Reasoning: This component standardizes text input fields across the application,
  // integrating react-hook-form for validation and state management, and applying
  // consistent styling from the Gluestack UI theme.
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <FormControl
            isRequired={isRequired}
            isInvalid={!!error}
            mb="$4" // Default margin bottom for spacing
            isDisabled={inputContainerProps.isDisabled}
            {...formControlProps} // Spread FormControl specific props
            testID={`form-control-${name}`}
        >
          <FormControlLabel mb="$1">
            <ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText>
          </FormControlLabel>
          <Input
              variant="outline" // Use theme's outline variant for inputs
              isInvalid={!!error}
              {...inputContainerProps} // Spread Input container specific props
          >
            <InputField
              placeholder={placeholder}
              value={value ?? ''} // Ensure value is controlled and defaults to empty string
              onChangeText={onChange}
              onBlur={onBlur}
              {...inputFieldProps} // Spread InputField specific props
            />
          </Input>
          {error && (
            <FormControlError mt="$1">
              <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
              <FormControlErrorText size="sm">{error.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      )}
    />
  );
};
export default StyledInput;
