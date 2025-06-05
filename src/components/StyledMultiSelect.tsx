// src/components/StyledMultiSelect.tsx
import React, { useState } from 'react';
import {
  FormControl, FormControlLabel, FormControlError, FormControlErrorIcon,
  FormControlErrorText, Button, ButtonText, ButtonIcon, ChevronDownIcon,
  Modal, ModalBackdrop, ModalContent, ModalHeader, Heading, ModalBody,
  ModalFooter, ModalCloseButton, Icon as GlueIconMulti, CloseIcon, CheckboxGroup, Checkbox,
  CheckboxIndicator, CheckboxIcon as CheckboxIconMulti, CheckboxLabel, CheckIcon as CheckIconMulti, ScrollView, Box,
  AlertCircleIcon
} from '@gluestack-ui/themed';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import ThemedText from './ThemedText';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type FormControlPropsMultiSelect = ComponentProps<typeof FormControl>;
// type ButtonPropsMultiSelect = ComponentProps<typeof Button>; // Not directly spread
// type ModalPropsMultiSelect = ComponentProps<typeof Modal>; // Not directly spread


interface OptionMultiSelect { label: string; value: string; }

interface StyledMultiSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  options: OptionMultiSelect[];
  isRequired?: boolean;
  placeholder?: string;
  control: Control<TFieldValues>;
  rules?: Omit<RegisterOptions<TFieldValues, Path<TFieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  formControlProps?: Partial<FormControlPropsMultiSelect>;
}

const StyledMultiSelect = <TFieldValues extends FieldValues>({
  name, label, control, options, rules, isRequired, placeholder = "Select categories...", formControlProps
}: StyledMultiSelectProps<TFieldValues>) => {
  // Reasoning: This component provides a user-friendly multi-select interface using a modal.
  // It integrates with react-hook-form for form state management and validation.
  const [showModal, setShowModal] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={[] as any} // Default value must be an array for multi-select
      render={({ field: { onChange, value = [] }, fieldState: { error } }) => (
        <FormControl isRequired={isRequired} isInvalid={!!error} mb="$4" {...formControlProps} testID={`form-control-multiselect-${name}`}>
          <FormControlLabel mb="$1">
            <ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText>
          </FormControlLabel>
          <Button
            variant="outline"
            borderColor={error ? '$errorBase' : '$inputBorder'}
            justifyContent="space-between"
            alignItems="center"
            onPress={() => setShowModal(true)}
            disabled={options.length === 0}
            testID="multiselect-trigger-button"
          >
            <ButtonText color={value?.length > 0 ? '$textPrimary' : '$inputPlaceholder'} numberOfLines={1} ellipsizeMode="tail">
              {value?.length > 0 ? `${value.length} selected` : placeholder}
            </ButtonText>
            <ButtonIcon as={ChevronDownIcon} color="$iconColorMuted" />
          </Button>
          {error && (
            <FormControlError mt="$1">
              <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
              <FormControlErrorText size="sm">{error.message}</FormControlErrorText>
            </FormControlError>
          )}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg" finalFocusRef={React.createRef()}>
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Heading size="lg">{label}</Heading>
                <ModalCloseButton onPress={() => setShowModal(false)}>
                  <GlueIconMulti as={CloseIcon} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <ScrollView maxHeight={300} showsVerticalScrollIndicator={false}>
                  <CheckboxGroup
                    value={value} // RHF value
                    onChange={(newValues: string[]) => onChange(newValues)} // RHF onChange
                    accessibilityLabel={`Select options for ${label}`}
                  >
                    {options.map((option) => (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        size="md"
                        my="$2"
                        accessibilityLabel={option.label}
                        aria-label={option.label} // Ensure aria-label for Checkbox
                      >
                        <CheckboxIndicator mr="$2">
                          <CheckboxIconMulti as={CheckIconMulti} />
                        </CheckboxIndicator>
                        <CheckboxLabel>{option.label}</CheckboxLabel>
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </ScrollView>
              </ModalBody>
              <ModalFooter>
                 <SecondaryButton title="Clear All" onPress={() => onChange([])} mr="$3" />
                 <PrimaryButton title="Done" onPress={() => setShowModal(false)} />
              </ModalFooter>
            </ModalContent>
          </Modal>
        </FormControl>
      )}
    />
  );
};
export default StyledMultiSelect;
