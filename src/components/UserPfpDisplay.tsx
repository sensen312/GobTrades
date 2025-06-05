// src/components/UserPfpDisplay.tsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallbackText } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

// Get Avatar props type using ComponentProps
type AvatarPropsPFP = ComponentProps<typeof Avatar>;

// Master Lith: Ensure these paths are correct and assets exist in 'assets/images/'
const PFP_MAP_DISPLAY: Record<string, any> = {
  'goblin1': require('../../assets/images/pfp-goblin-1.png'),
  'goblin2': require('../../assets/images/pfp-goblin-2.png'),
  'goblin3': require('../../assets/images/pfp-goblin-3.png'),
  'goblin4': require('../../assets/images/pfp-goblin-4.png'),
  'goblin5': require('../../assets/images/pfp-goblin-5.png'),
  'goblin6': require('../../assets/images/pfp-goblin-6.png'),
  'goblin7': require('../../assets/images/pfp-goblin-7.png'),
  'goblin8': require('../../assets/images/pfp-goblin-8.png'),
  'default': require('../../assets/images/pfp-default.png'), // Fallback image
};
// Extend AvatarProps, omitting children handled internally
interface UserPfpDisplayProps extends Omit<AvatarPropsPFP, 'children'> {
  pfpIdentifier: string | null | undefined;
  userName?: string;
}

/** Displays the user's profile picture based on identifier. */
const UserPfpDisplay: React.FC<UserPfpDisplayProps> = ({
    pfpIdentifier,
    userName = '?', // Default fallback text if name is not provided
    size = 'md', // Default Gluestack Avatar size
    ...avatarProps // Spread remaining AvatarProps
}) => {
  // Determine the image source based on pfpIdentifier, defaulting to 'default' if null, undefined, or not found.
  const imageSource = PFP_MAP_DISPLAY[pfpIdentifier || 'default'] || PFP_MAP_DISPLAY['default'];
  // Generate fallback text from the first character of the userName.
  const fallbackText = userName?.charAt(0).toUpperCase() || '?';
  // Accessible alt text for the image.
  const altText = userName && userName !== '?' ? `${userName}'s profile picture` : 'Profile picture';

  return (
    <Avatar size={size} {...avatarProps}>
      <AvatarImage source={imageSource} alt={altText} />
      <AvatarFallbackText>{fallbackText}</AvatarFallbackText>
    </Avatar>
  );
};
export default UserPfpDisplay;
