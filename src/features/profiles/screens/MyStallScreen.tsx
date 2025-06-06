// src/features/profiles/screens/MyStallScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Heading, VStack, Input, HStack, Pressable, Image } from '@gluestack-ui/themed';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ScreenContainer from '../../../components/ScreenContainer';
import PrimaryButton from '../../../components/PrimaryButton';
import KeyboardAvoidingViewWrapper from '../../../components/KeyboardAvoidingViewWrapper';
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import IconButton from '../../../components/IconButton';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import ConfirmationPrompt from '../../../components/ConfirmationPrompt';
import ThemedText from '../../../components/ThemedText';
import ImagePickerInput, { ImagePickerObjectType } from '../../../components/ImagePickerInput';
import StyledTextarea from '../../../components/StyledTextarea';
import StyledMultiSelect from '../../../components/StyledMultiSelect';
import { useAuthStore } from '../../auth/store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useMarketTimer } from '../../../hooks/useMarketTimer';
import { MyStallScreenRouteProp, AppStackParamList } from '../../../navigation/types';
import { STALL_TAGS } from '../../../constants/tags';
import { ImageObject, Item, UserProfile } from '../../../types';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import { IMAGE_API_PATH } from '../../../api';
import EmptyState from '../../../components/EmptyState';

const stallSchema = z.object({
  offeredItemsDescription: z.string().min(1, 'Offered items description is required.').max(500, 'Max 500 characters.'),
  wantedItemsDescription: z.string().min(1, 'Wanted items description is required.').max(500, 'Max 500 characters.'),
  offeredItemTags: z.array(z.string()).max(4, 'Maximum of 4 offered item tags.').optional(),
  wantsTags: z.array(z.string()).max(4, 'Maximum of 4 wanted tags.').optional(),
});
type StallFormData = z.infer<typeof stallSchema>;

const MyStallScreen: React.FC = () => {
    const route = useRoute<MyStallScreenRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
    const isFirstSetup = route.params?.isFirstSetup || false;
    const maxImages = 10;

    const { goblinName, pfpIdentifier, uuid: userUuid } = useAuthStore();
    const { isMarketOpen } = useMarketTimer();
    const {
        myStallData, myStallServerData, fetchMyStall, saveMyStall,
        myStallFetchStatus, myStallSaveStatus, hasUnsavedChanges,
        setHasUnsavedChanges, resetMyStallToLastSaved, error: profileStoreError,
    } = useProfileStore();

    const [localItems, setLocalItems] = useState<Item[]>([]);
    const [itemToRemove, setItemToRemove] = useState<Item | null>(null);
    const [isRemoveConfirmVisible, setIsRemoveConfirmVisible] = useState(false);
    const draggableFlatListRef = useRef<DraggableFlatList<Item>>(null);

    const { control, handleSubmit, reset: resetForm, formState: { errors, isDirty, isValid }, watch } = useForm<StallFormData>({
        resolver: zodResolver(stallSchema), mode: 'onChange',
    });
    
    // ... Full component logic ...

    return (
        <ScreenContainer>
            {/* Full implemented JSX */}
        </ScreenContainer>
    );
};

export default MyStallScreen;
