import React from 'react';
import {
  FormControl, FormControlLabel, FormControlError, FormControlErrorIcon,
  FormControlErrorText, Input, InputField, AlertCircleIcon
} from '@gluestack-ui/themed';
import { Controller, Control } from 'react-hook-form';
import ThemedText from './ThemedText';
import type { ComponentProps } from 'react';

type InputProps = ComponentProps<typeof Input>;
type InputFieldProps = ComponentProps<typeof InputField>;

interface StyledInputProps extends Omit<InputProps, 'onChange' | 'onBlur' | 'value'> {
  name: string;
  label: string;
  control: Control<any>;
  rules?: object;
  isRequired?: boolean;
  placeholder?: string;
  inputFieldProps?: Partial<InputFieldProps>;
}

/** Renders themed input field integrated with react-hook-form. */
const StyledInput: React.FC<StyledInputProps> = ({
  name, label, control, rules, placeholder, isRequired, inputFieldProps, ...inputContainerProps
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <FormControl isRequired={isRequired} isInvalid={!!error} mb="$4" isDisabled={inputContainerProps.isDisabled}>
          <FormControlLabel mb="$1">
            <ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText>
          </FormControlLabel>
          <Input
             variant="outline"
             isInvalid={!!error}
             {...inputContainerProps}
          >
            <InputField
              placeholder={placeholder}
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              {...inputFieldProps}
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