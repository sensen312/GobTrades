// src/features/profiles/screens/MyStallScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Heading, VStack, Input as GlueInput, HStack, Icon as GlueStackIcon, Pressable, Image as GlueImage } from '@gluestack-ui/themed'; // Added GlueImage
import type { ComponentProps } from 'react';
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
import ImagePickerInput from '../../../components/ImagePickerInput';
import StyledTextarea from '../../../components/StyledTextarea';
import StyledMultiSelect from '../../../components/StyledMultiSelect';
import { useAuthStore as useAuthStoreMyStall } from '../../auth/store/authStore';
import { useProfileStore as useProfileStoreMyStall } from '../store/profileStore';
import { useMarketTimer as useMarketTimerMyStall } from '../../../hooks/useMarketTimer';
import { MyStallScreenRouteProp, AppStackParamList } from '../../../navigation/types';
import { ITEM_TAGS, WANTS_TAGS } from '../../../constants/tags';
import { ImageObject as AppImageObject, Item as ModelItemFromTypes, UserProfile as ModelUserProfileFromTypes } from '../../../types'; // Renamed to avoid conflict
import { showErrorToast } from '../../../utils/toast';
import { IMAGE_API_PATH } from '../../../api';

type GlueInputPropsMyStall = ComponentProps<typeof GlueInput>;

const stallSchema = z.object({
  offeredItemsDescription: z.string().min(1, 'Offered items description is required.').max(500, 'Max 500 characters.'),
  wantedItemsDescription: z.string().min(1, 'Wanted items description is required.').max(500, 'Max 500 characters.'),
  offeredItemTags: z.array(z.string()).max(4, 'Maximum of 4 offered item tags.').optional(),
  wantsTags: z.array(z.string()).max(4, 'Maximum of 4 wanted tags.').optional(),
});
type StallFormData = z.infer<typeof stallSchema>;

// Use imported ModelItem
interface StallItemLocal extends ModelItemFromTypes {
  // localId is already in ModelItemFromTypes via Item type
  uri?: string;
  isNew?: boolean;
  originalFilename?: string;
  type?: string; // Mime type
  name?: string; // Filename for new images (already part of Item as itemName, but image picker might use 'name')
}

const MyStallScreen: React.FC = () => {
  const route = useRoute<MyStallScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const isFirstSetup = route.params?.isFirstSetup || false;

  const { goblinName, pfpIdentifier, uuid: userUuid } = useAuthStoreMyStall();
  const { isMarketOpen } = useMarketTimerMyStall();
  const {
    myStallData: stallDataFromStore, myStallServerData, fetchMyStall, saveMyStall,
    myStallFetchStatus, myStallSaveStatus, hasUnsavedChanges,
    setHasUnsavedChanges, resetMyStallToLastSaved, error: profileStoreError,
  } = useProfileStoreMyStall();

  const [localItems, setLocalItems] = useState<StallItemLocal[]>([]);
  const [itemToRemove, setItemToRemove] = useState<StallItemLocal | null>(null);
  const [isRemoveConfirmVisible, setIsRemoveConfirmVisible] = useState(false);
  // Correctly type the ref for DraggableFlatList
  const draggableFlatListRef = useRef<DraggableFlatList<StallItemLocal>>(null);


  const { control, handleSubmit, reset: resetForm, formState: { errors, isDirty: formIsDirty, isValid: formIsValid }, watch, setValue } = useForm<StallFormData>({
    resolver: zodResolver(stallSchema), mode: 'onChange',
    defaultValues: {
      offeredItemsDescription: '', wantedItemsDescription: '',
      offeredItemTags: [], wantsTags: [],
    },
  });

  const watchedFormValues = watch();

  useEffect(() => {
    if (stallDataFromStore) {
      resetForm({
        offeredItemsDescription: stallDataFromStore.offeredItemsDescription || '',
        wantedItemsDescription: stallDataFromStore.wantedItemsDescription || '',
        offeredItemTags: stallDataFromStore.offeredItemTags || [],
        wantsTags: stallDataFromStore.wantsTags || [],
      });
      const storeItemsAsLocal: StallItemLocal[] = stallDataFromStore.items.map((item: ModelItemFromTypes) => ({ // Ensure item is typed
        ...item,
        localId: item.dbId || item.localId || uuid.v4() as string,
        uri: item.imageFilename && !item.imageFilename.startsWith('file:') && !item.imageFilename.startsWith('http') && item.dbId
            ? `${IMAGE_API_PATH}${item.imageFilename}`
            : item.imageFilename,
        isNew: !item.dbId,
        originalFilename: item.dbId ? item.imageFilename : undefined,
      }));
      setLocalItems(storeItemsAsLocal);
    } else if (!isFirstSetup) {
        fetchMyStall();
    }
  }, [stallDataFromStore, resetForm, isFirstSetup, fetchMyStall]);

  useEffect(() => {
    const formValues = watchedFormValues;
    let itemsChanged = false;
    if (myStallServerData) {
        const currentItemsForCompare = localItems.map(i => ({ itemName: i.itemName, imageFilename: i.isNew ? i.name : i.originalFilename, dbId: i.dbId })); // Use i.name for new items
        const serverItemsForCompare = myStallServerData.items.map((i: ModelItemFromTypes) => ({ itemName: i.itemName, imageFilename: i.imageFilename, dbId: i.dbId }));
        itemsChanged = JSON.stringify(currentItemsForCompare) !== JSON.stringify(serverItemsForCompare);
    } else if (localItems.length > 0) {
        itemsChanged = true;
    }

    const descChanged = myStallServerData ? (formValues.offeredItemsDescription !== myStallServerData.offeredItemsDescription || formValues.wantedItemsDescription !== myStallServerData.wantedItemsDescription) : (formValues.offeredItemsDescription !== '' || formValues.wantedItemsDescription !== '');
    const tagsChanged = myStallServerData ? (JSON.stringify(formValues.offeredItemTags || []) !== JSON.stringify(myStallServerData.offeredItemTags || []) || JSON.stringify(formValues.wantsTags || []) !== JSON.stringify(myStallServerData.wantsTags || [])) : ((formValues.offeredItemTags && formValues.offeredItemTags.length > 0) || (formValues.wantsTags && formValues.wantsTags.length > 0));

    setHasUnsavedChanges(itemsChanged || descChanged || tagsChanged || formIsDirty);
  }, [localItems, watchedFormValues, myStallServerData, setHasUnsavedChanges, formIsDirty]);

  useFocusEffect( useCallback(() => {
    let hasUnsavedChangesOnFocus = useProfileStoreMyStall.getState().hasUnsavedChanges;
    return () => {
      if (hasUnsavedChangesOnFocus && useProfileStoreMyStall.getState().hasUnsavedChanges) {
        Alert.alert(
          "Discard Unsaved Wares?",
          "You have unsaved changes to your stall. Are you sure you want to leave and discard them?",
          [
            { text: "Stay Put", style: "cancel", onPress: () => {} },
            { text: "Discard Changes", style: "destructive", onPress: () => {
                console.log("MyStallScreen: Discarding unsaved changes on blur confirmation.");
                resetMyStallToLastSaved();
            }}
          ], {cancelable: false}
        );
      }
    };
  }, [resetMyStallToLastSaved]) );


  const handleImagePickerChange = useCallback((newImageObjectsFromPicker: AppImageObject[]) => {
    const newLocalItems: StallItemLocal[] = newImageObjectsFromPicker.map((imgObj, idx) => {
        const existingItem = localItems.find(li => li.localId === imgObj.localId && !li.isNew);
        if (existingItem) {
            return existingItem;
        }
        return {
            localId: imgObj.localId,
            itemName: imgObj.name || `Shiny Treasure ${localItems.length + idx + 1}`,
            imageFilename: imgObj.name || `new_item_${Date.now()}_${idx}.jpg`, // This is the client-derived name for new files
            uri: imgObj.uri,
            isNew: true,
            type: imgObj.type,
            name: imgObj.name, // Keep from ImageObject
            dbId: imgObj.dbId,
            originalFilename: imgObj.originalFilename,
        };
    });
    setLocalItems(newLocalItems);
    setHasUnsavedChanges(true);
}, [localItems]);


  const handleItemNameChange = (localId: string, newName: string) => {
    setLocalItems(prevItems => prevItems.map(item => item.localId === localId ? { ...item, itemName: newName } : item));
    setHasUnsavedChanges(true);
  };

  const confirmRemoveItem = (item: StallItemLocal) => { setItemToRemove(item); setIsRemoveConfirmVisible(true); };
  const executeRemoveItem = () => {
    if (itemToRemove) {
      const updatedImageObjects = localItems.filter(item => item.localId !== itemToRemove.localId).map(li => ({
          uri: li.uri || '',
          name: li.name || li.itemName,
          type: li.type,
          localId: li.localId,
          isNew: !!li.isNew,
          originalFilename: li.originalFilename,
          dbId: li.dbId,
      }));
      handleImagePickerChange(updatedImageObjects);
    }
    setIsRemoveConfirmVisible(false); setItemToRemove(null);
  };

  const handleItemReorder = ({ data }: { data: StallItemLocal[] }) => {
    setLocalItems(data);
    setHasUnsavedChanges(true);
    console.log("MyStallScreen: Items reordered by drag-and-drop.");
  };

  const onSaveStall: SubmitHandler<StallFormData> = async (formDataFromHook) => {
    if (!isMarketOpen && !isFirstSetup) {
        showErrorToast("Market is Closed!", "You cannot save your stall while the market is closed.");
        return;
    }
    if (localItems.length === 0) {
        showErrorToast("You must have at least one item in your stall to save.", "Empty Stall");
        return;
    }

    const profileToSave: ModelUserProfileFromTypes = { // Explicitly type this
      ...(stallDataFromStore || {} as ModelUserProfileFromTypes),
      _id: stallDataFromStore?._id || '',
      uuid: userUuid!,
      goblinName: goblinName!,
      pfpIdentifier: pfpIdentifier!,
      items: localItems.map(li => ({
        localId: li.localId, // Always pass localId
        dbId: li.dbId,
        itemName: li.itemName,
        imageFilename: li.isNew ? (li.name || li.imageFilename) : (li.originalFilename || li.imageFilename),
      })),
      offeredItemsDescription: formDataFromHook.offeredItemsDescription,
      wantedItemsDescription: formDataFromHook.wantedItemsDescription,
      offeredItemTags: formDataFromHook.offeredItemTags || [],
      wantsTags: formDataFromHook.wantsTags || [],
      lastActive: new Date().toISOString(),
      likeCount: stallDataFromStore?.likeCount || 0,
      createdAt: stallDataFromStore?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newImagesToUpload: AppImageObject[] = localItems
      .filter(item => item.isNew && item.uri)
      .map(item => ({
        uri: item.uri!,
        name: item.name || item.imageFilename,
        type: item.type || 'image/jpeg',
        localId: item.localId,
        isNew: true,
        originalFilename: undefined,
        dbId: undefined,
    }));

    const savedProfile = await saveMyStall(profileToSave, newImagesToUpload, isFirstSetup);
    if (savedProfile) {
        if (isFirstSetup) {
            navigation.replace('Main', { screen: 'Trades', params: { screen: 'ProfileFeedScreen'} });
        } else {
            const updatedLocalItemsFromServer: StallItemLocal[] = savedProfile.items.map((serverItem: ModelItemFromTypes) => { // Type serverItem
                const correspondingLocal = localItems.find(li => (li.isNew && li.localId === serverItem.localId) || (!li.isNew && li.dbId === serverItem.dbId) );
                return {
                    ...serverItem,
                    localId: correspondingLocal?.localId || serverItem.dbId || uuid.v4() as string,
                    uri: serverItem.imageFilename && !serverItem.imageFilename.startsWith('file:') ? `${IMAGE_API_PATH}${serverItem.imageFilename}` : serverItem.imageFilename,
                    isNew: !serverItem.dbId,
                    originalFilename: serverItem.dbId ? serverItem.imageFilename : undefined,
                };
            });
            setLocalItems(updatedLocalItemsFromServer);
        }
    }
  };

  if (myStallFetchStatus === 'loading' && !isFirstSetup && !stallDataFromStore) return <ScreenContainer><LoadingIndicator text="Fetching your stall..." /></ScreenContainer>;
  if (myStallFetchStatus === 'error' && !isFirstSetup) return <ScreenContainer><ErrorDisplay title="Stall Fetch Error" message={profileStoreError || "Could not load your stall."} /></ScreenContainer>;

  const imagePickerInitialItems: AppImageObject[] = localItems.map(item => ({
    uri: item.uri || (item.originalFilename ? `${IMAGE_API_PATH}${item.originalFilename}` : (item.imageFilename && !item.imageFilename.startsWith('file:') ? `${IMAGE_API_PATH}${item.imageFilename}` : '')),
    name: item.name || item.itemName,
    type: item.isNew ? item.type : undefined,
    localId: item.localId,
    isNew: !!item.isNew,
    originalFilename: item.originalFilename,
    dbId: item.dbId,
  }));

  const renderDraggableItem = ({ item, drag, isActive, getIndex }: RenderItemParams<StallItemLocal>) => {
    const index = getIndex();
    return (
      <ScaleDecorator>
        <Pressable onLongPress={drag} disabled={isActive}>
          <HStack
            space="sm" alignItems="center" mb="$2" borderWidth={1}
            borderColor={isActive ? "$goblinGreen500" : "$borderLight"}
            p="$2" borderRadius="$md" bg="$backgroundCard"
            opacity={isActive ? 0.8 : 1}
          >
            <Box w={60} h={60} bg="$parchment100" borderRadius="$sm" justifyContent="center" alignItems="center" mr="$2">
                {item.uri ? (
                    <GlueImage source={{ uri: item.uri }} alt={item.itemName} size="full" borderRadius="$sm" resizeMode="cover"/>
                ) : (
                    <ThemedText size="xs" color="$textSecondary">Img {index !== undefined ? index + 1 : ''}</ThemedText>
                )}
            </Box>
            <Box flex={1}>
              <GlueInput variant="outline" size="sm" isReadOnly={myStallSaveStatus === 'loading'}>
                <GlueInput.Input
                  value={item.itemName}
                  onChangeText={(text) => handleItemNameChange(item.localId, text)}
                  placeholder={`Item ${index !== undefined ? index + 1 : '?'} Name`}
                  aria-label={`Item ${item.itemName || (index !== undefined ? index + 1 : '')} name`}
                  fontFamily="$body"
                />
              </GlueInput>
            </Box>
            <IconButton iconName="drag-horizontal-variant" iconColor="$iconColorMuted" onPressIn={drag} aria-label={`Reorder ${item.itemName}`} />
            <IconButton iconName="trash-can-outline" iconColor="$errorBase" aria-label={`Remove ${item.itemName}`} onPress={() => confirmRemoveItem(item)} />
          </HStack>
        </Pressable>
      </ScaleDecorator>
    );
  };

  return (
    <ScreenContainer scrollable={false} p="$0" testID="my-stall-screen">
      <KeyboardAvoidingViewWrapper>
        <VStack flex={1}>
          {isFirstSetup && (
            <Box bg="$goblinGreen100" p="$3" borderRadius="$md" m="$4">
              <Heading size="md" textAlign="center" fontFamily="$heading" color="$goblinGreen800">Create Your Stall!</Heading>
              <ThemedText size="sm" textAlign="center" color="$goblinGreen700" mt="$1">Add items, describe what you offer and seek, then save to join the market!</ThemedText>
            </Box>
          )}
          <VStack space="md" p="$4" pb={0}>
            <HStack alignItems="center" space="md" mb="$2">
                <UserPfpDisplay pfpIdentifier={pfpIdentifier} userName={goblinName || ''} size="md" />
                <Heading size="lg" fontFamily="$heading">{goblinName}'s Stall</Heading>
            </HStack>
            <Heading size="md">Images of Your Wares ({imagePickerInitialItems.length}/{maxImages})</Heading>
            <ThemedText size="xs" color="$textSecondary" mb="$2">
                Add up to {maxImages} images for your items. You can name each item in the list below.
            </ThemedText>
            <ImagePickerInput
                initialImages={imagePickerInitialItems}
                onImagesChange={handleImagePickerChange}
                maxImages={maxImages}
            />
            <Heading size="md" mt="$4">Your Item List (Drag to Reorder)</Heading>
            <ThemedText size="xs" color="$textSecondary" mb="$2">
                Name your items. Press and hold an item to drag and reorder.
            </ThemedText>
          </VStack>
          <Box flex={1} px="$4">
             {localItems.length === 0 && !isFirstSetup && myStallFetchStatus === 'success' && (
                 <EmptyState message="Your stall is empty. Add some images and items above!" title="No Wares Yet" iconName="barrel-outline" />
             )}
             {localItems.length > 0 && (
                <DraggableFlatList
                    ref={draggableFlatListRef}
                    data={localItems}
                    onDragEnd={handleItemReorder}
                    keyExtractor={(item) => item.localId}
                    renderItem={renderDraggableItem}
                    showsVerticalScrollIndicator={false}
                    containerStyle={{ flex: 1 }} // Ensure it takes space
                />
             )}
          </Box>
          <VStack space="md" p="$4" mt={localItems.length > 0 ? "$0" : "$2"} pb="$24">
            <StyledTextarea name="offeredItemsDescription" label="Describe What You Offer:" control={control} rules={{ required: 'This description is required.' }} placeholder="E.g., Shiny trinkets, potent potions..." maxLength={500} isRequired />
            <StyledTextarea name="wantedItemsDescription" label="Describe What You Seek:" control={control} rules={{ required: 'This description is required.' }} placeholder="E.g., Lost socks, rare mushrooms..." maxLength={500} isRequired />
            <StyledMultiSelect name="offeredItemTags" label="Your Item Tags (Max 4):" control={control} options={ITEM_TAGS} placeholder="Select offered tags..." rules={{ validate: (tags) => (tags && tags.length > 4) ? "Max 4 tags" : true }}/>
            <StyledMultiSelect name="wantsTags" label="Tags for Items You Want (Max 4):" control={control} options={WANTS_TAGS} placeholder="Select wanted tags..." rules={{ validate: (tags) => (tags && tags.length > 4) ? "Max 4 tags" : true }}/>
            {profileStoreError && <ErrorDisplay message={profileStoreError} title="Save Error" />}
            {isFirstSetup && (<ThemedText size="xs" color="$textSecondary" textAlign="center" my="$3">By saving, you are listing your stall on the public trade board.</ThemedText>)}
          </VStack>
        </VStack>
      </KeyboardAvoidingViewWrapper>
      <Box p="$4" borderTopWidth={1} borderColor="$borderLight" bg="$backgroundCard" position="absolute" bottom={0} left={0} right={0}>
        <PrimaryButton
          title="Save Stall" onPress={handleSubmit(onSaveStall)}
          isLoading={myStallSaveStatus === 'loading'}
          disabled={
            (!isMarketOpen && !isFirstSetup) ||
            (!hasUnsavedChanges && !isFirstSetup) ||
            myStallSaveStatus === 'loading' ||
            !formIsValid ||
            (localItems.length === 0) // Always require at least one item
          }
          size="lg"
          testID="save-stall-button"
        />
      </Box>
      <ConfirmationPrompt isOpen={isRemoveConfirmVisible} onClose={() => setIsRemoveConfirmVisible(false)} onConfirm={executeRemoveItem} title="Remove Item?" message={`Are you sure you want to remove "${itemToRemove?.itemName || 'this item'}"?`} confirmText="Remove" />
    </ScreenContainer>
  );
};
export default MyStallScreen;
