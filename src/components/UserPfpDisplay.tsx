// src/components/UserPfpDisplay.tsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallbackText } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

// Get Avatar props type using ComponentProps
type AvatarProps = ComponentProps<typeof Avatar>;

const PFP_MAP: Record<string, any> = {
  'goblin1': require('../assets/images/pfp-goblin-1.png'), // Replace with actual paths
  'goblin2': require('../assets/images/pfp-goblin-2.png'), // Replace with actual paths
  'goblin3': require('../assets/images/pfp-goblin-3.png'), // Replace with actual paths
  'goblin4': require('../assets/images/pfp-goblin-4.png'), // Replace with actual paths
  'goblin5': require('../assets/images/pfp-goblin-5.png'), // Replace with actual paths
  'goblin6': require('../assets/images/pfp-goblin-6.png'), // Replace with actual paths
  'goblin7': require('../assets/images/pfp-goblin-7.png'), // Replace with actual paths
  'goblin8': require('../assets/images/pfp-goblin-8.png'), // Replace with actual paths
  'default': require('../assets/images/pfp-default.png'), // Fallback image
};
// Extend AvatarProps, omitting children handled internally
interface UserPfpDisplayProps extends Omit<AvatarProps, 'children'> {
  pfpIdentifier: string | null | undefined;
  userName?: string;
}

/** Displays the user's profile picture based on identifier. */
const UserPfpDisplay: React.FC<UserPfpDisplayProps> = ({
    pfpIdentifier,
    userName = '?',
    size = 'md',
    ...avatarProps // Spread remaining AvatarProps
}) => {
  const imageSource = PFP_MAP[pfpIdentifier || 'default'] || PFP_MAP['default'];
  const fallbackText = userName?.charAt(0).toUpperCase() || '?';
  const altText = userName && userName !== '?' ? `${userName}'s profile picture` : 'Profile picture';

  return (
    <Avatar size={size} {...avatarProps}>
      <AvatarImage source={imageSource} alt={altText} />
      <AvatarFallbackText>{fallbackText}</AvatarFallbackText>
    </Avatar>
  );
};
export default UserPfpDisplay;