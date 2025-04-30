import React, { useEffect, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native'; // Import RefreshControl
import { Box, useToken } from '@gluestack-ui/themed';

import ScreenContainer from '../../../components/ScreenContainer';
import ListingCard from '../components/ListingCard'; // Import the component
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import EmptyState from '../../../components/EmptyState';
import { useListingsStore } from '../store/listingsStore';
import { ListingsScreenProps } from '../../../navigation/types';

type Props = ListingsScreenProps<'LikedListings'>;

const LikedListingsScreen: React.FC<Props> = ({ navigation }) => {
    // Select necessary state and actions from the store
    const {
        likedListings, fetchLikedListings, likedListingsStatus, error,
        likedListingsPagination, loadMoreLikedListings
    } = useListingsStore(state => ({
        likedListings: state.likedListings,
        fetchLikedListings: state.fetchLikedListings,
        likedListingsStatus: state.likedListingsStatus,
        error: state.error,
        likedListingsPagination: state.likedListingsPagination,
        loadMoreLikedListings: state.loadMoreLikedListings,
    }));

    // State for controlling the refresh indicator
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    // Resolve theme color for the refresh control spinner
    const primaryColor = useToken('colors', 'primary500');

    // Memoized fetch function
    const handleFetch = useCallback((refresh = false) => {
        fetchLikedListings(refresh);
    }, [fetchLikedListings]);

    // Fetch data when the screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
             // Fetch only if not already loading to avoid redundant calls on focus
             if (likedListingsStatus !== 'loading' && likedListingsStatus !== 'refreshing') {
                 handleFetch();
             }
        });
        // Initial fetch if needed (consider if data persists or needs refresh)
        // handleFetch(); // Uncomment if initial fetch on mount is desired regardless of focus
        return unsubscribe; // Cleanup listener on unmount
    }, [navigation, handleFetch, likedListingsStatus]);

    // Handle pull-to-refresh action
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await handleFetch(true); // Fetch with refresh flag
        setIsRefreshing(false);
    }, [handleFetch]);

     // Handle reaching the end of the list for pagination
    const handleLoadMore = () => {
        // Trigger load more only if not already loading and more data exists
        if (likedListingsStatus !== 'loadingMore' && likedListingsPagination.hasMore) {
            loadMoreLikedListings();
        }
    };

    // Display loading indicator during initial load
    if (likedListingsStatus === 'loading' && likedListings.length === 0 && !isRefreshing) {
        return <ScreenContainer><LoadingIndicator text="Loading liked treasures..." /></ScreenContainer>;
    }

    // Display error message if initial load fails
    if (likedListingsStatus === 'error' && likedListings.length === 0) {
        return <ScreenContainer><ErrorDisplay title="Load Error" message={error || 'Could not load liked listings.'} /></ScreenContainer>;
    }

    return (
        // Use ScreenContainer for safe area and background
        <ScreenContainer>
             {/* Display error banner if subsequent fetch/load fails but list has items */}
             {likedListingsStatus === 'error' && likedListings.length > 0 && <ErrorDisplay message={error} />}
            <FlatList
                data={likedListings}
                // ListingCard uses useNavigation hook, no need to pass prop
                renderItem={({ item }) => <ListingCard listing={item} />}
                keyExtractor={(item) => item._id}
                // Setup RefreshControl for pull-to-refresh
                refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={handleRefresh}
                      colors={[primaryColor]} // Android spinner color
                      tintColor={primaryColor} // iOS spinner color
                    />
                  }
                // Pagination trigger
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5} // Trigger when 50% from end
                // Display empty state message when load succeeds but no items found
                ListEmptyComponent={
                    likedListingsStatus === 'success' ? (
                        <EmptyState
                            iconName="heart-off-outline"
                            title="No Liked Treasures"
                            message="Tap the heart icon on listings you want to save!"
                        />
                    ) : null
                }
                 // Show loading indicator at the bottom when loading more pages
                ListFooterComponent={likedListingsStatus === 'loadingMore' ? <LoadingIndicator size="small" /> : null}
                contentContainerStyle={{ flexGrow: 1 }} // Ensure empty state can fill space
            />
        </ScreenContainer>
    );
};

export default LikedListingsScreen;