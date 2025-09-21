import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme

// Splash Screen Component
interface SplashScreenProps {
  navigation?: any; // Make navigation prop optional
}

const SplashScreen = () => { // Removed navigation prop from here as it's now optional and not used internally for navigation
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
