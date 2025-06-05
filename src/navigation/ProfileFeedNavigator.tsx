// src/navigation/ProfileFeedNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileFeedStackParamList } from './types';
import ProfileFeedScreen from '../features/profiles/screens/ProfileFeedScreen';

const StackProfileFeedNav = createNativeStackNavigator<ProfileFeedStackParamList>();

const ProfileFeedNavigator: React.FC = () => {
  return (
    <StackProfileFeedNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackProfileFeedNav.Screen name="ProfileFeedScreen" component={ProfileFeedScreen} />
    </StackProfileFeedNav.Navigator>
  );
};
export default ProfileFeedNavigator;
