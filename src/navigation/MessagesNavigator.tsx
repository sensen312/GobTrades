// src/navigation/MessagesNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessagesStackParamList } from './types';
import MessagingListScreen from '../features/messaging/screens/MessagingListScreen';

const StackMessagesNav = createNativeStackNavigator<MessagesStackParamList>();

const MessagesNavigator: React.FC = () => {
  return (
    <StackMessagesNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackMessagesNav.Screen name="MessagingListScreen" component={MessagingListScreen} />
    </StackMessagesNav.Navigator>
  );
};
export default MessagesNavigator;
