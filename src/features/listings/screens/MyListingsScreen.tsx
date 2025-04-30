import React, { useEffect, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native'; // Import RefreshControl
import { Box, useToken } from '@gluestack-ui/themed';

import ScreenContainer from '../../../components/ScreenContainer';
import ListingCard from '../components/ListingCard';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import EmptyState from '../../../components/EmptyState';
import { useListingsStore } from '../store/listingsStore';
import { ListingsScreenProps } from '../../../navigation/types';

type Props = ListingsScreenProps<'MyListings'>;

const MyListingsScreen: React.FC<Props> = ({ navigation }) => {
    // Select state and actions related to user's own listings
    const {
        myListings, fetchMyListings, myListingsStatus, error,
        myListingsPagination, loadMoreMyListings
    } = useListingsStore(state => ({
        myListings: state.myListings,
        fetchMyListings: state.fetchMyListings,
        myListingsStatus: state.myListingsStatus,
        error: state.error,
        myListingsPagination: state.myListingsPagination,
        loadMoreMyListings: state.loadMoreMyListings,
    }));

    const [isRefreshing, setIsRefreshing] = React.useState(false);
    // Resolve theme color for refresh spinner
    const primaryColor = useToken('colors', 'primary500');

    // Memoized fetch function
    const handleFetch = useCallback((refresh = false) => {
        fetchMyListings(refresh);
    }, [fetchMyListings]);

     // Fetch data when the screen comes into focus
     useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch only if not already loading to prevent redundant calls
            if (myListingsStatus !== 'loading' && myListingsStatus !== 'refreshing') {
                handleFetch();
            }
        });
        // Initial fetch might be desired on mount too
        // handleFetch(); // Uncomment if needed
        return unsubscribe; // Cleanup listener
    }, [navigation, handleFetch, myListingsStatus]);

    // Handle pull-to-refresh
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await handleFetch(true); // Fetch with refresh=true
        setIsRefreshing(false);
    }, [handleFetch]);

     // Handle loading more items
    const handleLoadMore = () => {
        // Check status and if more pages exist
        if (myListingsStatus !== 'loadingMore' && myListingsPagination.hasMore) {
            loadMoreMyListings();
        }
    };

    // Initial loading state
    if (myListingsStatus === 'loading' && myListings.length === 0 && !isRefreshing) {
        return <ScreenContainer><LoadingIndicator text="Loading your treasures..." /></ScreenContainer>;
    }

    // Initial error state
    if (myListingsStatus === 'error' && myListings.length === 0) {
        return <ScreenContainer><ErrorDisplay title="Load Error" message={error || 'Could not load your listings.'} /></ScreenContainer>;
    }


    return (
        // Use ScreenContainer for safe area and background
        <ScreenContainer>
            {/* Optional: Show error banner even if list has items */}
            {myListingsStatus === 'error' && myListings.length > 0 && <ErrorDisplay message={error} />}
            <FlatList
                data={myListings}
                // Remove the incorrect navigation prop
                renderItem={({ item }) => <ListingCard listing={item} />}
                keyExtractor={(item) => item._id}
                // Add RefreshControl
                refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={handleRefresh}
                      colors={[primaryColor]}
                      tintColor={primaryColor}
                    />
                }
                // Pagination
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                // Empty state component
                ListEmptyComponent={
                     myListingsStatus === 'success' ? (
                         <EmptyState
                            iconName="treasure-chest-outline"
                            title="No Treasures Posted"
                            message="You haven't listed any items yet. Tap the 'Create' tab to add your first treasure!"
                         />
                     ) : null
                 }
                 // Loading more indicator
                ListFooterComponent={myListingsStatus === 'loadingMore' ? <LoadingIndicator size="small" /> : null}
                contentContainerStyle={{ flexGrow: 1 }} // Ensure empty state fills view
            />
        </ScreenContainer>
    );
};

export default MyListingsScreen;