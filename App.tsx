import React from 'react';
import { View, StyleSheet } from 'react-native'; // Import View and StyleSheet
import AppNavigator from './src/navigation/AppNavigator';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon set
import { colors } from './src/theme/colors'; // Import colors

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.black, // Set the root background to black
  },
});

export default function App() {
  return (
    <View style={styles.appContainer}>
      <AppNavigator />
    </View>
  );
}
