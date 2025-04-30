// File: src/features/listings/components/ListingCard.tsx
import React from 'react';
// Removed useToken as it's causing type issues with this specific token alias
import { Box, Image, Pressable, VStack, HStack, Heading, Text, Icon } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNowStrict } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedText from '../../../components/ThemedText';
import TagDisplay from '../../../components/TagDisplay';
import IconButton from '../../../components/IconButton';
import { Listing, UserProfile } from '../../../types';
import { useListingsStore } from '../store/listingsStore';
import { useAuthStore } from '../../auth/store/authStore';
import { ListingsScreenProps, MessagesStackParamList } from '../../../navigation/types';
import { config } from '../../../theme'; // Import full theme config
import { IMAGE_API_PATH } from '../../../api';


// Interface for component props
interface ListingCardProps {
    listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    if (!listing) {
        return null;
    }

    const navigation = useNavigation<ListingsScreenProps<'ListingsFeed'>['navigation']>();
    const currentUserUuid = useAuthStore(state => state.uuid);
    const { toggleLike, likedListings } = useListingsStore(state => ({
        toggleLike: state.toggleLike,
        likedListings: state.likedListings,
    }));

    const isLiked = likedListings.some(liked => liked._id === listing._id);

    // Access colors directly from the theme config object
    const likedHeartColor = config.tokens.colors.likedHeart;
    // Access the intended value for muted color directly from theme config
    const iconColorMutedValue = config.tokens.colors.textSecondary; // Use the final hex value defined for textSecondary

    const imageBorderRadius = config.tokens.radii.sm;

    const handlePress = () => {
        navigation.navigate('ListingDetail', { listingId: listing._id });
    };

    const handleLikePress = (e: any) => {
        e.stopPropagation();
        toggleLike(listing._id);
    };

    const handleMessagePress = (e: any) => {
        e.stopPropagation();
        if (listing.userId && listing._id) {
            const chatParams: MessagesStackParamList['Chat'] = {
                listingId: listing._id,
                otherUserId: listing.userId,
                otherUserName: listing.goblinName,
            };
            console.log(`Navigating to chat for listing ${listing._id} with user ${listing.userId}`);
            navigation.navigate('Messages', {
                screen: 'Chat',
                params: chatParams,
            });
        } else {
            console.error("Missing listing user ID or listing ID to initiate chat.");
        }
    };

    const timeAgo = listing.createdAt
        ? formatDistanceToNowStrict(new Date(listing.createdAt), { addSuffix: true })
        : 'unknown';

    const primaryImage = listing.primaryImageFilename || listing.imageFilenames?.[0];
    const imageUrl = primaryImage ? `${IMAGE_API_PATH}${primaryImage}` : undefined;

    const isOwnListing = currentUserUuid === listing.userId;

    // Function to render the placeholder icon directly
    const renderPlaceholderIcon = () => {
        const iconSize = 32; // Define icon size

        return (
            <MaterialCommunityIcons
                name="image-off-outline"
                size={iconSize}
                // Pass the direct hex value resolved from the theme config
                color={iconColorMutedValue}
            />
        );
    };

    return (
        <Pressable onPress={handlePress} mb="$4">
            {({ pressed }) => (
                <Box
                    bg="$backgroundCard"
                    borderRadius="$md"
                    borderWidth={1}
                    borderColor={isOwnListing ? "$goblinGreen500" : "$borderLight"}
                    opacity={pressed ? 0.8 : 1.0}
                    shadowColor="$shadowColor"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={3}
                    elevation={2}
                    overflow="hidden"
                >
                    {/* Image Section */}
                     {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            alt={listing.itemName || 'Listing image'}
                            w="100%"
                            h={180}
                            resizeMode="cover"
                            borderTopLeftRadius={imageBorderRadius}
                            borderTopRightRadius={imageBorderRadius}
                        />
                    ) : (
                        <Box w="100%" h={180} bg="$parchment200" justifyContent="center" alignItems="center"
                            borderTopLeftRadius={imageBorderRadius}
                            borderTopRightRadius={imageBorderRadius}
                        >
                            {renderPlaceholderIcon()}
                        </Box>
                     )}


                    {/* Content Section */}
                    <VStack p="$3" space="sm">
                        <HStack justifyContent="space-between" alignItems="center">
                            <Heading size="md" numberOfLines={1} ellipsizeMode="tail" flex={1} mr="$2">{listing.itemName}</Heading>
                             <IconButton
                                iconName={isLiked ? "heart" : "heart-outline"}
                                // Use direct theme value for like button color
                                iconColor={isLiked ? likedHeartColor : iconColorMutedValue}
                                iconSize={22}
                                onPress={handleLikePress}
                                aria-label={isLiked ? "Unlike item" : "Like item"}
                                hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                            />
                        </HStack>

                        <ThemedText size="sm" color="$textSecondary">
                            Trader: {listing.goblinName || 'Mysterious Goblin'}
                        </ThemedText>

                        {/* Item Tags */}
                        {listing.tags && listing.tags.length > 0 && (
                            <Box>
                                <ThemedText size="xs" bold color="$textSecondary">Item Tags:</ThemedText>
                                <HStack flexWrap="wrap" mt="$1">
                                    {listing.tags.slice(0, 3).map((tag, index) => (
                                        <TagDisplay key={`item-${tag}-${index}`} tag={tag} />
                                    ))}
                                    {listing.tags.length > 3 && <ThemedText size="xs" color="$textSecondary" ml="$1" alignSelf="center"> +{listing.tags.length - 3} more</ThemedText>}
                                </HStack>
                            </Box>
                        )}

                        {/* Wants Tags */}
                        {listing.wantsTags && listing.wantsTags.length > 0 && (
                             <Box mt="$1">
                                <ThemedText size="xs" bold color="$textSecondary">Looking For:</ThemedText>
                                <HStack flexWrap="wrap" mt="$1">
                                    {listing.wantsTags.slice(0, 3).map((tag, index) => (
                                        <TagDisplay key={`wants-${tag}-${index}`} tag={tag} />
                                    ))}
                                    {listing.wantsTags.length > 3 && <ThemedText size="xs" color="$textSecondary" ml="$1" alignSelf="center"> +{listing.wantsTags.length - 3} more</ThemedText>}
                                </HStack>
                             </Box>
                        )}

                        <HStack justifyContent="space-between" alignItems="center" mt="$2">
                            <ThemedText size="xs" color="$textSecondary">
                                Posted {timeAgo}
                            </ThemedText>
                             {!isOwnListing && (
                                <IconButton
                                    iconName="message-outline"
                                    // Use direct theme token name for IconButton (assuming it handles resolution)
                                    // Or pass the resolved value: iconColor={iconColorMutedValue}
                                    iconColor="$iconColorMuted"
                                    iconSize={20}
                                    onPress={handleMessagePress}
                                    aria-label="Message trader"
                                    hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                                />
                             )}
                        </HStack>
                    </VStack>
                </Box>
            )}
        </Pressable>
    );
};

export default ListingCard;