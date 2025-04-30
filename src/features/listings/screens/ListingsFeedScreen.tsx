// File: src/features/listings/screens/ListingsFeedScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box, Fab, FabIcon, AddIcon, useToken } from '@gluestack-ui/themed';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { showErrorToast, showSuccessToast } from '../../../utils/toast'; // Import toast utils
import { useListingsStore } from '../store/listingsStore';
import ListingCard from '../components/ListingCard';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import EmptyState from '../../../components/EmptyState';
import SearchInput from '../components/SearchInput';
import IconButton from '../../../components/IconButton';
// Import the specific navigation props type
import { ListingsScreenProps, AppStackParamList } from '../../../navigation/types';
import { FilterIcon } from 'lucide-react-native'; // Use your preferred icon library
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Or this
import { config } from '../../../theme';


type Props = ListingsScreenProps<'ListingsFeed'>;
// Define navigation prop type for navigating outside the current stack (e.g., to a modal)
type AppNavigationProp = Props['navigation']; // Use the composite prop type


const ListingsFeedScreen: React.FC<Props> = ({ navigation }) => {
    // Correctly select feedStatus and ensure resetFeed is selected
    const {
        feedListings,
        fetchFeed,
        loadMoreFeed,
        feedStatus, // Use feedStatus instead of generic status
        error,
        resetFeed, // Ensure resetFeed is selected
        feedPagination,
        searchTerm,
        setSearchTerm,
        setFilters
    } = useListingsStore();

    const [isRefreshing, setIsRefreshing] = useState(false);
    // Resolve theme color token for RefreshControl spinner
    const primaryColor = useToken('colors', 'primary500');
    // Get the root navigation object to navigate to modals outside the current stack
    const rootNavigation = useNavigation<AppNavigationProp>();


    // Fetch data when the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log("ListingsFeedScreen focused, fetching initial feed...");
            // Fetch only if the status indicates it's appropriate (idle or error)
             // Use feedStatus here
            if (feedStatus === 'idle' || feedStatus === 'error') {
                resetFeed();
                fetchFeed(); // Pass refresh=false implicitly
            }
        // Add feedStatus and resetFeed to dependencies if they might change identities
        }, [feedStatus, fetchFeed, resetFeed])
    );


    // Handle pull-to-refresh
    const handleRefresh = useCallback(async () => {
        console.log("Refreshing feed...");
        setIsRefreshing(true);
        // Ensure resetFeed is called before fetchFeed(true)
        // The store's fetchFeed(true) should handle the reset internally now
        await fetchFeed(true); // Pass refresh flag
        setIsRefreshing(false);
        console.log("Refresh complete.");
    // Add fetchFeed to dependency array
    }, [fetchFeed]);

    // Handle loading more items when reaching the end of the list
    const handleLoadMore = () => {
         // Check feedStatus and pagination state
        if (feedStatus !== 'loadingMore' && feedStatus !== 'refreshing' && feedStatus !== 'loading' && feedPagination.hasMore) {
            console.log("Loading more feed items...");
            loadMoreFeed(); // Call the specific action for loading more feed items
        }
    };

    // Navigate to the Filter Modal screen
    const openFilterModal = () => {
        console.log("Navigate to Filter Modal");
        // Navigate using the root navigator if FilterModal is in AppStack
        // Ensure 'FilterModal' exists in your AppStackParamList
        // rootNavigation.navigate('FilterModal');
         showErrorToast("Filter modal not implemented yet.", "Info"); // Placeholder feedback
    };

    // Configure header options dynamically
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    iconName="filter-variant" // MaterialCommunityIcons name
                    onPress={openFilterModal}
                    aria-label="Filter listings"
                    iconColor={config.tokens.colors.iconColor}
                />
            ),
            headerTitle: () => (
                 // Example: Search bar in header
                <Box flex={1} ml="$2" mr="$10">
                    <SearchInput
                         value={searchTerm}
                         onChangeText={setSearchTerm} // Debounced in the store
                         placeholder="Search treasures..."
                     />
                 </Box>
            )
        });
    // Add dependencies if these options rely on changing state/props
    }, [navigation, searchTerm, setSearchTerm]);


    // --- Render Logic ---
    const renderContent = () => {
        // Initial loading state (when list is empty and loading)
         // Check feedStatus
        if (feedStatus === 'loading' && feedListings.length === 0 && !isRefreshing) {
             console.log("Render: Initial Loading State");
            return <LoadingIndicator overlay text="Fetching treasures..." />;
        }

        // Initial error state (when list is empty and error occurred)
         // Check feedStatus
        if (feedStatus === 'error' && feedListings.length === 0) {
             console.log("Render: Initial Error State");
            return <Box flex={1} justifyContent="center" alignItems="center" p="$4">
                        <ErrorDisplay title="Bummer!" message={error || 'Could not load listings.'} />
                   </Box>;
        }

        // Render the list or empty state
        return (
            <FlatList
                data={feedListings}
                renderItem={({ item }) => <ListingCard listing={item} />} // navigation is handled internally
                keyExtractor={(item) => item._id}
                // Pull-to-refresh setup
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    colors={[primaryColor]}
                    tintColor={primaryColor}
                  />
                }
                // Infinite scroll setup
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.6}
                // Empty list component shown on success with no items
                ListEmptyComponent={
                     // Check feedStatus
                     feedStatus === 'success' && feedListings.length === 0
                     ? <EmptyState message="No treasures found matching your criteria." />
                     : null
                 }
                // Footer component shows loading indicator when fetching more pages
                ListFooterComponent={
                     // Check feedStatus
                    feedStatus === 'loadingMore'
                    ? <Box my="$4"><LoadingIndicator size="small" /></Box>
                    : null
                 }
                // Styling and performance
                contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            />
        );
    };


    return (
        <Box flex={1} bg="$backgroundLight">
             {/* Persistent error banner (if fetch/load fails but list has items) */}
             {/* Check feedStatus */}
             {feedStatus === 'error' && feedListings.length > 0 && (
                <Box px="$4" pt="$2">
                    <ErrorDisplay message={error || 'Could not load more listings.'} />
                </Box>
             )}
            {renderContent()}
        </Box>
    );
};

export default ListingsFeedScreen;