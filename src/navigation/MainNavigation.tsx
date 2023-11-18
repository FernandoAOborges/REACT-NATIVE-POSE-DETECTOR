/* eslint-disable object-curly-newline */

import * as React from 'react';
import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { ImageDetector } from '@/pages';

const DEFAULT_HEADER_OPTIONS: NativeStackNavigationOptions = {
  title: 'Image Detector',

  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#47bef3',
  },
};

export type MainNavigationParamList = {
  imageDetector: undefined;
};

export interface PageProps<T extends keyof MainNavigationParamList> {
  navigation: NativeStackNavigationProp<MainNavigationParamList, T>;
  route: RouteProp<MainNavigationParamList, T>;
}

const Stack = createNativeStackNavigator<MainNavigationParamList>();

const MainNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen name="imageDetector" component={ImageDetector} options={DEFAULT_HEADER_OPTIONS} />
  </Stack.Navigator>
);

export default MainNavigation;
