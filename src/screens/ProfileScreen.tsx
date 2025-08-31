import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

// Profile Screen Component
interface ProfileScreenProps {
  navigation: any; // Add navigation prop
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Placeholder user data
  const user = {
    name: 'John Doe',
    age: 30,
    height: '175 cm',
    sessionsPending: 5,
    avatar: require('../images/logo.png'), // Placeholder avatar
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    // Navigate back to OTP screen on logout
    navigation.reset({
      index: 0,
      routes: [{ name: 'OTP' }],
    });
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <View style={AppStyles.profileContainer}>
      <Text style={AppStyles.sectionTitle}>PROFILE</Text>
      <View style={AppStyles.profileHeader}>
        <Image source={user.avatar} style={AppStyles.profileAvatar} />
        <Text style={AppStyles.profileName}>{user.name}</Text>
        <Text style={AppStyles.profileAge}>{user.age} years old</Text>
      </View>

      <View style={AppStyles.profileDetailsContainer}>
        <View style={AppStyles.detailRow}>
          <Icon name="arrows-v" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
          <Text style={AppStyles.profileDetailText}>Height: <Text style={AppStyles.profileDetailBold}>{user.height}</Text></Text>
        </View>
        <View style={AppStyles.detailRow}>
          <Icon name="calendar-check-o" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
          <Text style={AppStyles.profileDetailText}>Sessions Pending: <Text style={AppStyles.profileDetailBold}>{user.sessionsPending}</Text></Text>
        </View>
      </View>

      <TouchableOpacity style={AppStyles.logoutButton} onPress={handleLogout}>
        <Text style={AppStyles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>

      <Modal
        visible={showLogoutConfirm}
        transparent={true}
        animationType="fade"
      >
        <View style={AppStyles.modalContainer}>
          <View style={AppStyles.modalContent}>
            <Text style={{ fontSize: 60, color: '#ff0000' }}>✓</Text>
            <Text style={AppStyles.modalTitle}>Confirm Logout</Text>
            <Text style={AppStyles.modalText}>Are you sure you want to log out?</Text>
            <View style={AppStyles.modalButtonContainer}>
              <TouchableOpacity style={[AppStyles.modalButton, AppStyles.modalButtonCancel]} onPress={cancelLogout}>
                <Text style={AppStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[AppStyles.modalButton, AppStyles.modalButtonConfirm]} onPress={confirmLogout}>
                <Text style={AppStyles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
