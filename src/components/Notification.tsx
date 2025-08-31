import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme

// Notification Component
interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  isVisible: boolean;
}

const Notification = ({ message, type, onClose, isVisible }: NotificationProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => onClose());
        }, 3000); // Notification visible for 3 seconds
      });
    }
  }, [isVisible, fadeAnim, onClose]);

  if (!isVisible) {
    return null;
  }

  const backgroundColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : colors.darkGray;
  const textColor = colors.lightGray;

  return (
    <Animated.View style={[styles.notificationContainer, { backgroundColor, opacity: fadeAnim }]}>
      <Text style={[styles.notificationText, { color: textColor }]}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={styles.notificationCloseButton}>
          <Text style={{ color: textColor, fontSize: 20 }}>X</Text>
        </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight || 0, // Position below status bar
    width: '90%',
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's on top
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  notificationCloseButton: {
    marginLeft: 10,
  },
});

export default Notification;
