import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import { getUserById } from '../api';

// Profile Screen Component
interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // User data state
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobileNumber: '',
    height: '',
    weight: '',
  });

  const [measurements, setMeasurements] = useState({
    chest: '',
    upperWaist: '',
    midWaist: '',
    lowerWaist: '',
    rightThigh: '',
    leftThigh: '',
    rightArm: '',
    leftArm: '',
  });

  const [bca, setBca] = useState({
    weight: '',
    bmi: '',
    bodyFat: '',
    muscleRate: '',
    subcutaneousFat: '',
    visceralFat: '',
    bodyAge: '',
    bmr: '',
    skeletalMass: '',
    muscleMass: '',
    boneMass: '',
    protein: '',
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('🔄 ProfileScreen: Fetching user data...');

        // Get userId from AsyncStorage
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('📦 Stored User ID:', storedUserId);

        if (!storedUserId) {
          Alert.alert('Error', 'User not logged in. Please log in again.');
          navigation.reset({
            index: 0,
            routes: [{ name: 'OTP' }],
          });
          return;
        }

        setUserId(storedUserId);

        // Fetch user data from backend
        console.log('🌐 Calling getUserById API...');
        const response = await getUserById(storedUserId);
        console.log('✅ User Data Response:', JSON.stringify(response, null, 2));

        if (response.error) {
          console.error('❌ API Error:', response.error);
          Alert.alert('Error', response.error);
          setLoading(false);
          return;
        }

        if (response.success && response.data) {
          console.log('✅ Processing user data...');
          const user = response.data;

          // Update user details
          setUserDetails({
            name: user.name || '',
            mobileNumber: user.mobileNumber || user.phoneNumber || '',
            height: user.height ? `${user.height} cm` : '',
            weight: user.weight ? `${user.weight} kg` : '',
          });

          // Update measurements
          setMeasurements({
            chest: user.measurements_chest ? `${user.measurements_chest} cm` : '',
            upperWaist: user.measurements_upperWaist ? `${user.measurements_upperWaist} cm` : '',
            midWaist: user.measurements_midWaist ? `${user.measurements_midWaist} cm` : '',
            lowerWaist: user.measurements_lowerWaist ? `${user.measurements_lowerWaist} cm` : '',
            rightThigh: user.measurements_rightThigh ? `${user.measurements_rightThigh} cm` : '',
            leftThigh: user.measurements_leftThigh ? `${user.measurements_leftThigh} cm` : '',
            rightArm: user.measurements_rightArm ? `${user.measurements_rightArm} cm` : '',
            leftArm: user.measurements_leftArm ? `${user.measurements_leftArm} cm` : '',
          });

          // Update BCA data
          setBca({
            weight: user.bca_weight ? `${user.bca_weight} kg` : '',
            bmi: user.bca_bmi ? `${user.bca_bmi}` : '',
            bodyFat: user.bca_bodyFat ? `${user.bca_bodyFat}%` : '',
            muscleRate: user.bca_muscleRate ? `${user.bca_muscleRate}%` : '',
            subcutaneousFat: user.bca_subcutaneousFat ? `${user.bca_subcutaneousFat}%` : '',
            visceralFat: user.bca_visceralFat ? `${user.bca_visceralFat}` : '',
            bodyAge: user.bca_bodyAge ? `${user.bca_bodyAge}` : '',
            bmr: user.bca_bmr ? `${user.bca_bmr} kcal` : '',
            skeletalMass: user.bca_skeletalMass ? `${user.bca_skeletalMass} kg` : '',
            muscleMass: user.bca_muscleMass ? `${user.bca_muscleMass} kg` : '',
            boneMass: user.bca_boneMass ? `${user.bca_boneMass} kg` : '',
            protein: user.bca_protein ? `${user.bca_protein}%` : '',
          });

          console.log('✅ User data loaded successfully!');
          console.log('📊 Name:', user.name);
          console.log('📧 Email:', user.email);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

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

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={[AppStyles.profileContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={{ color: colors.lightGray, marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

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
        <Text style={AppStyles.profileName}>{userDetails.name || 'Guest User'}</Text>
        <Text style={AppStyles.profileSubtitle}>Fitness Enthusiast</Text>
        <View style={AppStyles.profileStats}>
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{userDetails.weight || 'N/A'}</Text>
            <Text style={AppStyles.statLabel}>Weight</Text>
          </View>
          <View style={AppStyles.statDivider} />
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{userDetails.height || 'N/A'}</Text>
            <Text style={AppStyles.statLabel}>Height</Text>
          </View>
          <View style={AppStyles.statDivider} />
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{bca.bmi || 'N/A'}</Text>
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
