import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import IntroductionScreen from '../screens/IntroductionScreen';
import OTPScreen from '../screens/OTPScreen';
import MainAppContent from '../screens/MainAppContent';
import ProfileScreen from '../screens/ProfileScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LocateUsScreen from '../screens/LocateUsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication status

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken'); // Assuming 'userToken' is stored on login
        if (userToken) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error reading token from AsyncStorage', error);
      } finally {
        setIsLoading(false); // Set loading to false once check is complete
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Optionally render a loading screen or null while checking auth status
    return null; // Or a custom loading component
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'MainApp' : 'Splash'} // Conditionally set initial route
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Intro" component={IntroductionScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="MainApp" component={MainAppContent} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="LocateUs" component={LocateUsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
