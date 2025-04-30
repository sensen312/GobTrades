// src/components/StyledSelect.tsx
import React from 'react';
import {
  FormControl, FormControlLabel, FormControlError, FormControlErrorIcon,
  FormControlErrorText, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal,
  SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator,
  SelectItem, ChevronDownIcon, AlertCircleIcon
} from '@gluestack-ui/themed';
import { Controller, Control } from 'react-hook-form';
import ThemedText from './ThemedText';
// Import ComponentProps for types
import type { ComponentProps } from 'react';

// Get Select props type using ComponentProps
type SelectProps = ComponentProps<typeof Select>;

// Structure for select options
interface Option { label: string; value: string; }

// Omit RHF controlled props from base SelectProps
interface StyledSelectProps extends Omit<SelectProps, 'selectedValue' | 'onValueChange'> {
  name: string;
  label: string;
  control: Control<any>;
  options: Option[];
  rules?: object;
  placeholder?: string;
  isRequired?: boolean;
}

/** Renders themed single-select dropdown connected to react-hook-form. */
const StyledSelect: React.FC<StyledSelectProps> = ({
  name, label, control, options, rules, placeholder = "Select an option...", isRequired, ...selectProps
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl isRequired={isRequired} isInvalid={!!error} mb="$4" isDisabled={selectProps.isDisabled}>
          <FormControlLabel mb="$1">
            <ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText>
          </FormControlLabel>
          <Select
            selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)}
            isInvalid={!!error}
            {...selectProps} // Pass rest like isDisabled
          >
             <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder={placeholder} />
              <SelectIcon as={ChevronDownIcon} mr="$3" color="$iconColorMuted" />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                 <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                {options.map((option) => (
                  <SelectItem key={option.value} label={option.label} value={option.value} />
                ))}
              </SelectContent>
            </SelectPortal>
           </Select>
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
export default StyledSelect;