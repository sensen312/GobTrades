// src/components/TagDisplay.tsx
import React from 'react';
import { Badge, BadgeText } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type BadgePropsTagDisplay = ComponentProps<typeof Badge>;

interface TagDisplayProps extends BadgePropsTagDisplay { // Allow passing Badge props
    tag: string;
}

/** Renders a single tag using a themed Badge. (Stories 35, 47) */
const TagDisplay: React.FC<TagDisplayProps> = ({ tag, ...badgeProps }) => (
    <Badge action="info" variant="solid" mr="$1.5" mb="$1.5" {...badgeProps}>
        <BadgeText>{tag}</BadgeText>
    </Badge>
);
export default TagDisplay;
