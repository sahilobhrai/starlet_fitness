import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

// Profile Screen Component
interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // User data state
  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    mobileNumber: '9876543210',
    height: '175 cm',
    weight: '70 kg',
  });

  const [measurements, setMeasurements] = useState({
    chest: '95 cm',
    upperWaist: '80 cm',
    midWaist: '78 cm',
    lowerWaist: '82 cm',
    rightThigh: '55 cm',
    leftThigh: '55 cm',
    rightArm: '30 cm',
    leftArm: '30 cm',
  });

  const [bca, setBca] = useState({
    weight: '70 kg',
    bmi: '22.86',
    bodyFat: '18%',
    muscleRate: '40%',
    subcutaneousFat: '15%',
    visceralFat: '8',
    bodyAge: '28',
    bmr: '1600 kcal',
    skeletalMass: '25 kg',
    muscleMass: '28 kg',
    boneMass: '3 kg',
    protein: '18%',
  });

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

  const renderModernCard = (title: string, children: React.ReactNode, iconName?: string) => (
    <View style={AppStyles.modernCard}>
      <View style={AppStyles.cardHeader}>
        {iconName && <Icon name={iconName} size={20} color={colors.red} style={AppStyles.cardHeaderIcon} />}
        <Text style={AppStyles.cardTitle}>{title}</Text>
      </View>
      <View style={AppStyles.cardContent}>
        {children}
      </View>
    </View>
  );

  const renderDetailRow = (label: string, value: string, iconName: string) => (
    <View style={AppStyles.modernDetailRow}>
      <View style={AppStyles.detailRowHeader}>
        <Icon name={iconName} size={16} color={colors.red} style={AppStyles.detailIcon} />
        <Text style={AppStyles.detailLabel}>{label}</Text>
      </View>
      <View style={AppStyles.detailValueContainer}>
        <Text style={AppStyles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  const renderEditableDetailRow = (label: string, value: string, onChangeText: (text: string) => void, placeholder?: string) => (
    <View style={AppStyles.modernDetailRow}>
      <View style={AppStyles.detailRowHeader}>
        <Text style={AppStyles.detailLabel}>{label}</Text>
      </View>
      <View style={AppStyles.inputContainer}>
        <TextInput
          style={AppStyles.modernInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          placeholderTextColor={colors.mediumGray}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={AppStyles.profileContainer} showsVerticalScrollIndicator={false}>
      {/* Modern Header Section */}
      <View style={AppStyles.profileHeader}>
        <View style={AppStyles.avatarContainer}>
          <Image source={require('../images/logo.png')} style={AppStyles.profileAvatar} />
          <View style={AppStyles.avatarOverlay}>
            <TouchableOpacity style={AppStyles.editAvatarButton}>
              <Icon name="camera" size={14} color={colors.lightGray} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={AppStyles.profileName}>{userDetails.name}</Text>
        <Text style={AppStyles.profileSubtitle}>Fitness Enthusiast</Text>
        <View style={AppStyles.profileStats}>
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{userDetails.weight}</Text>
            <Text style={AppStyles.statLabel}>Weight</Text>
          </View>
          <View style={AppStyles.statDivider} />
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{userDetails.height}</Text>
            <Text style={AppStyles.statLabel}>Height</Text>
          </View>
          <View style={AppStyles.statDivider} />
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{bca.bmi}</Text>
            <Text style={AppStyles.statLabel}>BMI</Text>
          </View>
        </View>
      </View>

      {/* User Details Section */}
      {renderModernCard(
        'Personal Information',
        <>
          {renderEditableDetailRow('Full Name', userDetails.name, (text) => setUserDetails({ ...userDetails, name: text }))}
          {renderEditableDetailRow('Mobile Number', userDetails.mobileNumber, (text) => setUserDetails({ ...userDetails, mobileNumber: text }))}
          {renderEditableDetailRow('Height', userDetails.height, (text) => setUserDetails({ ...userDetails, height: text }))}
          {renderEditableDetailRow('Weight', userDetails.weight, (text) => setUserDetails({ ...userDetails, weight: text }))}
        </>,
        'user'
      )}

      {/* Body Measurements Section */}
      {renderModernCard(
        'Body Measurements',
        <>
          <View style={AppStyles.measurementsGrid}>
            {renderEditableDetailRow('Chest', measurements.chest, (text) => setMeasurements({ ...measurements, chest: text }))}
            {renderEditableDetailRow('Upper Waist', measurements.upperWaist, (text) => setMeasurements({ ...measurements, upperWaist: text }))}
            {renderEditableDetailRow('Mid Waist', measurements.midWaist, (text) => setMeasurements({ ...measurements, midWaist: text }))}
            {renderEditableDetailRow('Lower Waist', measurements.lowerWaist, (text) => setMeasurements({ ...measurements, lowerWaist: text }))}
            {renderEditableDetailRow('Right Thigh', measurements.rightThigh, (text) => setMeasurements({ ...measurements, rightThigh: text }))}
            {renderEditableDetailRow('Left Thigh', measurements.leftThigh, (text) => setMeasurements({ ...measurements, leftThigh: text }))}
            {renderEditableDetailRow('Right Arm', measurements.rightArm, (text) => setMeasurements({ ...measurements, rightArm: text }))}
            {renderEditableDetailRow('Left Arm', measurements.leftArm, (text) => setMeasurements({ ...measurements, leftArm: text }))}
          </View>
        </>,
        'male'
      )}

      {/* Body Composition Analysis Section */}
      {renderModernCard(
        'Body Composition Analysis',
        <>
          <View style={AppStyles.bcaGrid}>
            {renderDetailRow('Weight', bca.weight, 'balance-scale')}
            {renderDetailRow('BMI', bca.bmi, 'calculator')}
            {renderDetailRow('Body Fat', bca.bodyFat, 'percent')}
            {renderDetailRow('Muscle Rate', bca.muscleRate, 'dumbbell')}
          </View>
          <View style={AppStyles.bcaGrid}>
            {renderDetailRow('Subcutaneous Fat', bca.subcutaneousFat, 'tint')}
            {renderDetailRow('Visceral Fat', bca.visceralFat, 'heartbeat')}
            {renderDetailRow('Body Age', bca.bodyAge, 'child')}
            {renderDetailRow('BMR', bca.bmr, 'fire')}
          </View>
          <View style={AppStyles.bcaGrid}>
            {renderDetailRow('Skeletal Mass', bca.skeletalMass, 'bone')}
            {renderDetailRow('Muscle Mass', bca.muscleMass, 'male')}
            {renderDetailRow('Bone Mass', bca.boneMass, 'medkit')}
            {renderDetailRow('Protein', bca.protein, 'flask')}
          </View>
        </>,
        'heartbeat'
      )}

      {/* Action Buttons */}
      <View style={AppStyles.profileActions}>
        <TouchableOpacity style={AppStyles.primaryButton} onPress={() => Alert.alert('Success', 'Profile updated successfully!')}>
          <Icon name="save" size={16} color={colors.lightGray} style={AppStyles.buttonIcon} />
          <Text style={AppStyles.primaryButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.secondaryButton} onPress={handleLogout}>
          <Icon name="sign-out" size={16} color={colors.red} style={AppStyles.buttonIcon} />
          <Text style={AppStyles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={AppStyles.modalOverlay}>
          <View style={AppStyles.logoutModal}>
            <View style={AppStyles.modalHeader}>
              <Icon name="sign-out" size={24} color={colors.red} />
              <Text style={AppStyles.modalTitle}>Confirm Logout</Text>
            </View>
            <Text style={AppStyles.modalText}>Are you sure you want to logout?</Text>
            <View style={AppStyles.modalButtons}>
              <TouchableOpacity style={AppStyles.cancelButton} onPress={cancelLogout}>
                <Text style={AppStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={AppStyles.confirmButton} onPress={confirmLogout}>
                <Text style={AppStyles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
