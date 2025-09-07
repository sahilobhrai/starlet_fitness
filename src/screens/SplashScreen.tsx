import React, { useEffect, useState } from 'react'; // Import useState
import { View, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Splash Screen Component
interface SplashScreenProps {
  navigation: any;
}

const SplashScreen = ({ navigation }: SplashScreenProps) => {
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

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace('MainApp');
        } else {
          navigation.replace('Intro');
        }
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [isLoading, isAuthenticated, navigation]);

  // Optionally render a loading screen or null while checking auth status
  if (isLoading) {
    return null; // Or a custom loading component
  }

  // The rest of the return statement is not needed if we navigate directly
  // However, to keep the original splash screen visible for a moment, we can keep it
  // and rely on the useEffect to navigate.
  return (
    <View style={styles.splashContainer}>
      <Image source={require('../images/logo_main.png')} style={styles.splashLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black
  },
  splashLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default SplashScreen;
