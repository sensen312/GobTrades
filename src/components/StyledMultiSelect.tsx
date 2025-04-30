import React, { useState } from 'react';
import {
  FormControl, FormControlLabel, FormControlError, FormControlErrorIcon,
  FormControlErrorText, Button, ButtonText, ButtonIcon, ChevronDownIcon,
  Modal, ModalBackdrop, ModalContent, ModalHeader, Heading, ModalBody,
  ModalFooter, ModalCloseButton, Icon, CloseIcon, CheckboxGroup, Checkbox,
  CheckboxIndicator, CheckboxIcon, CheckboxLabel, CheckIcon, ScrollView, Box,
  AlertCircleIcon
} from '@gluestack-ui/themed';
import { Controller, Control } from 'react-hook-form'; // Keep RHF support
import ThemedText from './ThemedText';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface Option { label: string; value: string; }

// Make control optional, add value/onChange for direct use
interface StyledMultiSelectProps {
  name: string; // Still useful for identification, even without RHF
  label: string;
  options: Option[];
  isRequired?: boolean;
  placeholder?: string;
  // RHF specific props (optional)
  control?: Control<any>;
  rules?: object;
  // Direct state management props (optional)
  value?: string[];
  onChange?: (value: string[]) => void;
}

const StyledMultiSelect: React.FC<StyledMultiSelectProps> = ({
  name, label, control, options, rules, isRequired, placeholder = "Select categories...",
  value: directValue, // Rename prop to avoid conflict
  onChange: directOnChange // Rename prop
}) => {
  const [showModal, setShowModal] = useState(false);

  // If RHF control is provided, use Controller
  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={[]} // Default value must be an array for multi-select
        render={({ field: { onChange, value = [] }, fieldState: { error } }) => (
          <FormControl isRequired={isRequired} isInvalid={!!error} mb="$4">
            {/* Label */}
            <FormControlLabel mb="$1">
              <ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText>
            </FormControlLabel>
            {/* Button Trigger */}
            <Button
              variant="outline"
              borderColor={error ? '$error500' : '$inputBorder'}
              justifyContent="space-between"
              alignItems="center"
              onPress={() => setShowModal(true)}
              disabled={options.length === 0}
            >
              <ButtonText color={value?.length > 0 ? '$textPrimary' : '$inputPlaceholder'} numberOfLines={1}>
                {value?.length > 0 ? `${value.length} selected` : placeholder}
              </ButtonText>
              <ButtonIcon as={ChevronDownIcon} color="$iconColorMuted" />
            </Button>
            {/* Error Message */}
            {error && ( <FormControlError mt="$1"><FormControlErrorIcon as={AlertCircleIcon} size="sm" /><FormControlErrorText size="sm">{error.message}</FormControlErrorText></FormControlError> )}
            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
              <ModalBackdrop />
              <ModalContent>
                <ModalHeader><Heading size="lg">{label}</Heading><ModalCloseButton><Icon as={CloseIcon} /></ModalCloseButton></ModalHeader>
                <ModalBody>
                  <ScrollView maxHeight={300} showsVerticalScrollIndicator={false}>
                    <CheckboxGroup value={value} onChange={onChange} accessibilityLabel={`Select options for ${label}`}>
                      {options.map((option) => (
                        <Checkbox key={option.value} value={option.value} size="md" my="$2" accessibilityLabel={option.label}>
                          <CheckboxIndicator mr="$2"><CheckboxIcon as={CheckIcon} /></CheckboxIndicator><CheckboxLabel>{option.label}</CheckboxLabel>
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
  }

  // --- Standalone implementation (using direct value/onChange) ---
  const currentVal = directValue || [];
  const handleChange = (newValue: string[]) => {
    if (directOnChange) {
      directOnChange(newValue);
    }
  };

  return (
    <FormControl isRequired={isRequired} mb="$4">
        {/* Label */}
       <FormControlLabel mb="$1"><ThemedText>{label}{isRequired ? ' *' : ''}</ThemedText></FormControlLabel>
        {/* Button Trigger */}
       <Button variant="outline" borderColor='$inputBorder' justifyContent="space-between" alignItems="center" onPress={() => setShowModal(true)} disabled={options.length === 0}>
           <ButtonText color={currentVal.length > 0 ? '$textPrimary' : '$inputPlaceholder'} numberOfLines={1}>
               {currentVal.length > 0 ? `${currentVal.length} selected` : placeholder}
           </ButtonText>
           <ButtonIcon as={ChevronDownIcon} color="$iconColorMuted" />
       </Button>
        {/* Modal (Standalone) */}
       <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
           <ModalBackdrop />
           <ModalContent>
               <ModalHeader><Heading size="lg">{label}</Heading><ModalCloseButton><Icon as={CloseIcon} /></ModalCloseButton></ModalHeader>
               <ModalBody>
                   <ScrollView maxHeight={300} showsVerticalScrollIndicator={false}>
                       <CheckboxGroup value={currentVal} onChange={handleChange} accessibilityLabel={`Select options for ${label}`}>
                           {options.map((option) => (
                               <Checkbox key={option.value} value={option.value} size="md" my="$2" accessibilityLabel={option.label}>
                                   <CheckboxIndicator mr="$2"><CheckboxIcon as={CheckIcon} /></CheckboxIndicator><CheckboxLabel>{option.label}</CheckboxLabel>
                               </Checkbox>
                           ))}
                       </CheckboxGroup>
                   </ScrollView>
               </ModalBody>
               <ModalFooter>
                  <SecondaryButton title="Clear All" onPress={() => handleChange([])} mr="$3" />
                  <PrimaryButton title="Done" onPress={() => setShowModal(false)} />
               </ModalFooter>
           </ModalContent>
       </Modal>
    </FormControl>
  );
};

export default StyledMultiSelect;
