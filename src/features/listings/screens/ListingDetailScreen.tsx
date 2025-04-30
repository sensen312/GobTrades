import React, { useEffect } from 'react';
import { Box, Heading, Text, ScrollView, HStack, VStack, Divider, Icon } from '@gluestack-ui/themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { formatDistanceToNowStrict } from 'date-fns';
import { HeartIcon, MessageCircleIcon, EditIcon, TrashIcon } from 'lucide-react-native'; // Assuming these icons

import ScreenContainer from '../../../components/ScreenContainer';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import ImageCarousel from '../../../components/ImageCarousel';
import TagDisplay from '../../../components/TagDisplay';
import ThemedText from '../../../components/ThemedText';
import IconButton from '../../../components/IconButton';
import ConfirmationPrompt from '../../../components/ConfirmationPrompt'; // For delete confirmation
import { useListingsStore } from '../store/listingsStore';
import { useAuthStore } from '../../auth/store/authStore'; // To check if user is owner
import { ListingsScreenProps } from '../../../navigation/types';
import { config } from '../../../theme'; // Import theme config for colors


type DetailScreenRouteProp = ListingsScreenProps<'ListingDetail'>['route'];
type DetailScreenNavigationProp = ListingsScreenProps<'ListingDetail'>['navigation'];

const ListingDetailScreen: React.FC = () => {
    const route = useRoute<DetailScreenRouteProp>();
    const navigation = useNavigation<DetailScreenNavigationProp>();
    const { listingId } = route.params;

    const {
        fetchListingDetails,
        clearListingDetails,
        toggleLike,
        deleteListing, // Add delete action
        detailedListing,
        detailStatus,
        mutationStatus, // For like/delete status
        likedListings, // Get liked listings to check like status
        error
    } = useListingsStore();

    const { uuid: currentUserUuid } = useAuthStore(); // Get current user's ID

    // State for delete confirmation modal
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    useEffect(() => {
        fetchListingDetails(listingId);
        // Clear details when the component unmounts
        return () => clearListingDetails();
    }, [listingId, fetchListingDetails, clearListingDetails]);

    if (detailStatus === 'loading') {
        return <LoadingIndicator overlay text="Loading treasure details..." />;
    }

    if (detailStatus === 'error' || !detailedListing) {
        return (
            <ScreenContainer>
                <ErrorDisplay title="Error" message={error || 'Could not load listing details.'} />
            </ScreenContainer>
        );
    }

    const listing = detailedListing;
    const isOwner = listing.userId === currentUserUuid; // Check if the current user owns this listing
    const isLiked = likedListings.some(liked => liked._id === listing._id);

    // --- Format Timestamps ---
    const timeAgo = listing.createdAt
        ? formatDistanceToNowStrict(new Date(listing.createdAt), { addSuffix: true })
        : 'unknown';
     const updatedAt = (listing.updatedAt && listing.updatedAt !== listing.createdAt)
        ? formatDistanceToNowStrict(new Date(listing.updatedAt), { addSuffix: true })
        : null;


    // --- Handlers ---
     const handleLikePress = () => {
        toggleLike(listing._id);
    };

    const handleMessagePress = () => {
         // Navigate to chat screen
          navigation.navigate('Messages', { // Navigate to Messages Tab first
             screen: 'Chat', // Then to Chat screen within Messages stack
             params: {
                 chatId: undefined, // Let backend/store handle finding/creating chat
                 listingId: listing._id,
                 otherUserId: listing.userId,
                 otherUserName: listing.goblinName, // Pass optional info
                 // otherUserPfpId: listing.userPfpId // If available
             },
          });
    };

     const handleEditPress = () => {
        navigation.navigate('EditListing', { listingId: listing._id });
    };

     const handleDeletePress = () => {
         setShowDeleteConfirm(true); // Open confirmation modal
     };

     const confirmDelete = async () => {
         const success = await deleteListing(listing._id);
         setShowDeleteConfirm(false);
         if (success) {
             // Navigate back to MyListings or Feed after successful deletion
             navigation.navigate('MyListings'); // Or navigation.goBack();
         }
         // Error toast handled by store
     };


    return (
        <ScreenContainer scrollable={true} edges={['left', 'right']} p="$0">
            <ScrollView>
                {/* Image Carousel */}
                <ImageCarousel imageFilenames={listing.imageFilenames || []} height={300} />

                {/* Content Area */}
                <VStack p="$4" space="md">
                    {/* Header: Title & Like */}
                    <HStack justifyContent="space-between" alignItems="flex-start">
                        <Heading size="xl" flex={1} mr="$3">{listing.itemName}</Heading>
                         {/* Like Button - Show only if NOT owner */}
                         {!isOwner && (
                            <IconButton
                                iconName={isLiked ? "heart" : "heart-outline"}
                                iconColor={isLiked ? config.tokens.colors.likedHeart : config.tokens.colors.iconColorMuted}
                                iconSize={28}
                                onPress={handleLikePress}
                                aria-label={isLiked ? "Unlike item" : "Like item"}
                                disabled={mutationStatus === 'loading'} // Disable while like is processing
                            />
                         )}
                         {/* Show Like Count if needed */}
                         {/* <ThemedText>{listing.likeCount}</ThemedText> */}
                    </HStack>

                    {/* Trader Info & Timestamp */}
                    <ThemedText size="md" color="$textSecondary">
                        Trader: {listing.goblinName || 'Mysterious Goblin'}
                    </ThemedText>
                    <ThemedText size="sm" color="$textSecondary">
                        Posted {timeAgo}
                         {updatedAt && ` (Updated ${updatedAt})`}
                    </ThemedText>

                    <Divider my="$2" />

                    {/* Description */}
                    <ThemedText>{listing.description}</ThemedText>

                    <Divider my="$2" />

                    {/* Item Tags */}
                    <Heading size="md">Item Tags</Heading>
                    <HStack flexWrap="wrap" mt="$2">
                        {listing.tags && listing.tags.length > 0 ? (
                            listing.tags.map((tag, index) => <TagDisplay key={`tag-${index}`} tag={tag} />)
                        ) : (
                            <ThemedText size="sm" color="$textSecondary">No tags specified.</ThemedText>
                        )}
                    </HStack>

                    <Divider my="$2" />

                     {/* Wants Tags */}
                    <Heading size="md">Looking For</Heading>
                    <HStack flexWrap="wrap" mt="$2">
                        {listing.wantsTags && listing.wantsTags.length > 0 ? (
                            listing.wantsTags.map((tag, index) => <TagDisplay key={`wants-${index}`} tag={tag} />)
                        ) : (
                            <ThemedText size="sm" color="$textSecondary">Open to offers.</ThemedText>
                        )}
                    </HStack>

                     <Divider my="$4" />

                     {/* Action Buttons */}
                     <HStack space="md" justifyContent="center">
                        {/* Show Edit/Delete only if owner */}
                        {isOwner ? (
                            <>
                                <IconButton
                                    iconName="pencil-outline" // Edit Icon
                                    iconSize={24}
                                    onPress={handleEditPress}
                                    aria-label="Edit listing"
                                    style={{ backgroundColor: config.tokens.colors.goblinGold100, padding: 12, borderRadius: 50 }} // Example style
                                    iconColor={config.tokens.colors.goblinGold700}
                                />
                                 <IconButton
                                    iconName="trash-can-outline" // Delete Icon
                                    iconSize={24}
                                    onPress={handleDeletePress}
                                    aria-label="Delete listing"
                                     style={{ backgroundColor: config.tokens.colors.errorBg, padding: 12, borderRadius: 50 }}
                                     iconColor={config.tokens.colors.errorBase}
                                     disabled={mutationStatus === 'loading'}
                                />
                                 {/* TODO: Add Mark as Traded Button */}
                            </>
                        ) : (
                             /* Show Message Button if NOT owner */
                             <IconButton
                                iconName="message-outline" // Message Icon
                                iconSize={24}
                                onPress={handleMessagePress}
                                aria-label="Message trader"
                                style={{ backgroundColor: config.tokens.colors.goblinGreen100, padding: 12, borderRadius: 50 }}
                                iconColor={config.tokens.colors.goblinGreen700}
                            />
                        )}
                     </HStack>

                </VStack>
            </ScrollView>

             {/* Delete Confirmation Modal */}
             <ConfirmationPrompt
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Listing?"
                message="Are you sure you want to permanently delete this treasure?"
                confirmText="Delete"
                isLoading={mutationStatus === 'loading'} // Show loading on confirm button
             />
        </ScreenContainer>
    );
};

export default ListingDetailScreen;