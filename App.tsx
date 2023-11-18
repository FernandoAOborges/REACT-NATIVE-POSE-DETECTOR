import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { config } from '@gluestack-ui/config';
import MainNavigation from '@/navigation/MainNavigation';

const App = () => (
  <GluestackUIProvider config={config}>
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#47bef3" />
        <MainNavigation />
      </SafeAreaView>
    </NavigationContainer>
  </GluestackUIProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
