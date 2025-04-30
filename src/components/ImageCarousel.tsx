import React, { useState, useRef, useCallback } from 'react';
import { FlatList, ViewToken, Dimensions, ViewabilityConfig } from 'react-native';
import { Image, Box, Pressable } from '@gluestack-ui/themed';
// Correctly import the base path for images
import { IMAGE_API_PATH } from '../api/index';

interface ImageCarouselProps {
  imageFilenames: string[];
  height?: number;
  onImagePress?: (index: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');

const ImageCarousel: React.FC<ImageCarouselProps> = ({
    imageFilenames = [],
    height = 300,
    onImagePress
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef<ViewabilityConfig>({ itemVisiblePercentThreshold: 50 }).current;

  const renderItem = ({ item: filename, index }: { item: string; index: number }) => {
    const imageUrl = `${IMAGE_API_PATH}${filename}`; // Construct full URL
    return (
        <Pressable onPress={() => onImagePress?.(index)} disabled={!onImagePress}>
            <Image
                source={{ uri: imageUrl }}
                alt={`Listing image ${index + 1}`}
                w={screenWidth}
                h={height}
                resizeMode="cover"
                // fallbackSource prop might not exist or work as expected with network images.
                // Handle image loading errors differently if needed (e.g., onError prop).
            />
        </Pressable>
    );
  }

  const renderPagination = () => (
    <Box
      position="absolute" bottom="$2" left={0} right={0}
      flexDirection="row" justifyContent="center" alignItems="center"
    >
      {imageFilenames.map((_, index) => (
        <Box
          key={`dot-${index}`}
          w={8} h={8} borderRadius="$full"
          bg={index === activeIndex ? "$primary500" : "$parchment500"}
          mx="$1" borderWidth={1}
          borderColor={index === activeIndex ? "$primary700" : "$parchment600"}
        />
      ))}
    </Box>
  );

  return (
    <Box h={height} w="$full" bg="$backgroundCard" overflow="hidden">
      <FlatList
        data={imageFilenames}
        renderItem={renderItem}
        keyExtractor={(item, index) => `carousel-img-${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />
      {imageFilenames.length > 1 && renderPagination()}
    </Box>
  );
};

export default ImageCarousel;