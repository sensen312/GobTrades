import React, { useEffect, useState } from 'react';
import { HStack, Image, Text, VStack, Pressable, Box } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useListingsStore } from '../../listings/store/listingsStore';
import { IMAGE_API_PATH } from '../../../api/index';
import { Listing } from '../../../types';
import { MessagesScreenProps } from '../../../navigation/types';
import ThemedText from '../../../components/ThemedText';
import type { ComponentProps } from 'react'; // Import ComponentProps

type ImageProps = ComponentProps<typeof Image>; // Get Image props type

interface AttachedItemPreviewProps {
  listingId: string;
  isOwner?: boolean;
}

const AttachedItemPreview: React.FC<AttachedItemPreviewProps> = ({ listingId, isOwner }) => {
  const navigation = useNavigation<MessagesScreenProps<'Chat'>['navigation']>();
  const { fetchListingDetails, detailedListing } = useListingsStore();
  const [item, setItem] = useState<Listing | null>(null);

  useEffect(() => {
    if (detailedListing?._id === listingId) {
        setItem(detailedListing);
    } else {
        fetchListingDetails(listingId);
    }
  }, [listingId, fetchListingDetails]); // Fetch when listingId changes

  useEffect(() => { // Update local state when store changes
    if (detailedListing?._id === listingId) {
      setItem(detailedListing);
    }
  }, [detailedListing, listingId]);

  const handlePress = () => {
      if (!item) return;
      // Navigate to EditListing (within ListingsStack) if owner, otherwise ListingDetail
      navigation.navigate('Listings', {
           screen: isOwner ? 'EditListing' : 'ListingDetail',
           params: { listingId: item._id }
       });
  };

  if (!item) {
    return <Box h={60} bg="$backgroundCard" p="$2" borderBottomWidth={1} borderColor="$borderLight" />;
  }

  const imageUrl = item.primaryImageFilename
    ? `${IMAGE_API_PATH}${item.primaryImageFilename}`
    : item.imageFilenames.length > 0 ? `${IMAGE_API_PATH}${item.imageFilenames[0]}` : undefined;

  return (
    <Pressable onPress={handlePress}>
      <HStack bg="$backgroundCard" p="$2" space="md" alignItems="center" borderBottomWidth={1} borderColor="$borderLight">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            alt={item.itemName}
            size="xs"
            borderRadius={4} // Use number directly or theme token like $xs
          />
        ) : (
            <Box
            // FIX: Use w/h instead of size
            w={50} h={50}
            bg="$parchment400" // Placeholder color
            borderRadius="$sm"
            justifyContent="center"
            alignItems="center"
         >
            {/* Optional: Add an icon */}
            {/* <Icon as={ImageOffIcon} size="sm" color="$textSecondary"/> */}
        </Box>
        )}
        <VStack flex={1}>
          <ThemedText size="sm" isTruncated bold>Chatting about:</ThemedText>
          <ThemedText size="sm" isTruncated>{item.itemName}</ThemedText>
        </VStack>
      </HStack>
    </Pressable>
  );
};
export default AttachedItemPreview;