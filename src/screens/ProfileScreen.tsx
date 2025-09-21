import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView, TextInput } from 'react-native';
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

  const renderDetailRow = (label: string, value: string, iconName: string) => (
    <View style={AppStyles.detailRow}>
      <Icon name={iconName} size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
      <Text style={AppStyles.profileDetailText}>{label}: <Text style={AppStyles.profileDetailBold}>{value}</Text></Text>
    </View>
  );

  const renderEditableDetailRow = (label: string, value: string, onChangeText: (text: string) => void) => (
    <View style={AppStyles.detailRow}>
      <Text style={AppStyles.profileDetailText}>{label}: </Text>
      <TextInput
        style={AppStyles.profileInput}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.mediumGray}
      />
    </View>
  );

  return (
    <ScrollView style={AppStyles.profileContainer}>
      <Text style={AppStyles.sectionTitle}>PROFILE</Text>
      <View style={AppStyles.profileHeader}>
        <Image source={require('../images/logo.png')} style={AppStyles.profileAvatar} />
        <Text style={AppStyles.profileName}>{userDetails.name}</Text>
        <Text style={AppStyles.profileAge}>User Profile</Text>
      </View>

      {/* User Details Section */}
      <View style={AppStyles.profileSection}>
        <Text style={AppStyles.profileSectionTitle}>User Details</Text>
        {renderEditableDetailRow('Name', userDetails.name, (text) => setUserDetails({ ...userDetails, name: text }))}
        {renderEditableDetailRow('Mobile Number', userDetails.mobileNumber, (text) => setUserDetails({ ...userDetails, mobileNumber: text }))}
        {renderEditableDetailRow('Height', userDetails.height, (text) => setUserDetails({ ...userDetails, height: text }))}
        {renderEditableDetailRow('Weight', userDetails.weight, (text) => setUserDetails({ ...userDetails, weight: text }))}
      </View>

      {/* Measurements Section */}
      <View style={AppStyles.profileSection}>
        <Text style={AppStyles.profileSectionTitle}>Measurements</Text>
        {renderEditableDetailRow('Chest', measurements.chest, (text) => setMeasurements({ ...measurements, chest: text }))}
        {renderEditableDetailRow('Upper Waist', measurements.upperWaist, (text) => setMeasurements({ ...measurements, upperWaist: text }))}
        {renderEditableDetailRow('Mid Waist', measurements.midWaist, (text) => setMeasurements({ ...measurements, midWaist: text }))}
        {renderEditableDetailRow('Lower Waist', measurements.lowerWaist, (text) => setMeasurements({ ...measurements, lowerWaist: text }))}
        {renderEditableDetailRow('Right Thigh', measurements.rightThigh, (text) => setMeasurements({ ...measurements, rightThigh: text }))}
        {renderEditableDetailRow('Left Thigh', measurements.leftThigh, (text) => setMeasurements({ ...measurements, leftThigh: text }))}
        {renderEditableDetailRow('Right Arm', measurements.rightArm, (text) => setMeasurements({ ...measurements, rightArm: text }))}
        {renderEditableDetailRow('Left Arm', measurements.leftArm, (text) => setMeasurements({ ...measurements, leftArm: text }))}
      </View>

      {/* Body Composition Analysis (BCA) Section */}
      <View style={AppStyles.profileSection}>
        <Text style={AppStyles.profileSectionTitle}>Body Composition Analysis (BCA)</Text>
        {renderDetailRow('Weight', bca.weight, 'balance-scale')}
        {renderDetailRow('BMI', bca.bmi, 'calculator')}
        {renderDetailRow('Body Fat', bca.bodyFat, 'percent')}
        {renderDetailRow('Muscle Rate', bca.muscleRate, 'dumbbell')}
        {renderDetailRow('Subcutaneous Fat', bca.subcutaneousFat, 'tint')}
        {renderDetailRow('Visceral Fat', bca.visceralFat, 'heartbeat')}
        {renderDetailRow('Body Age', bca.bodyAge, 'child')}
        {renderDetailRow('BMR', bca.bmr, 'fire')}
        {renderDetailRow('Skeletal Mass', bca.skeletalMass, 'bone')}
        {renderDetailRow('Muscle Mass', bca.muscleMass, 'male')}
        {renderDetailRow('Bone Mass', bca.boneMass, 'medkit')}
        {renderDetailRow('Protein', bca.protein, 'flask')}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
