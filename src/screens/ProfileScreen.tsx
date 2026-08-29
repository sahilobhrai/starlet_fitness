import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import { getClientProfile, updateClientProfile } from '../api';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    height: '',
    weight: '',
    branchName: '',
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
    muscleMassKg: '',
    muscleMassPercent: '',
    subcutaneousFat: '',
    visceralFat: '',
    bodyAge: '',
    bmr: '',
    skeletalMass: '',
    boneMass: '',
    protein: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, [navigation]);

  const fetchUserProfile = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');

      if (!storedUserId) {
        Alert.alert('Error', 'User not logged in. Please log in again.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'OTP' }],
        });
        return;
      }

      setUserId(storedUserId);

      const response = await getClientProfile(storedUserId);
      console.log('Profile Response:', response);

      if (response.error) {
        Alert.alert('Error', response.error);
        setLoading(false);
        return;
      }

      if (response.code === '100' && response.profile) {
        const profile = response.profile;

        setUserDetails({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          height: profile.height_cm ? `${profile.height_cm}` : '',
          weight: profile.weight_kg ? `${profile.weight_kg}` : '',
          branchName: profile.branch_name || '',
        });

        setMeasurements({
          chest: profile.measurements_chest_cm ? `${profile.measurements_chest_cm}` : '',
          upperWaist: profile.measurements_upper_waist_cm ? `${profile.measurements_upper_waist_cm}` : '',
          midWaist: profile.measurements_mid_waist_cm ? `${profile.measurements_mid_waist_cm}` : '',
          lowerWaist: profile.measurements_lower_waist_cm ? `${profile.measurements_lower_waist_cm}` : '',
          rightThigh: profile.measurements_rightThigh_cm ? `${profile.measurements_rightThigh_cm}` : '',
          leftThigh: profile.measurements_leftThigh_cm ? `${profile.measurements_leftThigh_cm}` : '',
          rightArm: profile.measurements_rightArm_cm ? `${profile.measurements_rightArm_cm}` : '',
          leftArm: profile.measurements_leftArm_cm ? `${profile.measurements_leftArm_cm}` : '',
        });

        setBca({
          weight: profile.bca_weight_kg ? `${profile.bca_weight_kg}` : '',
          bmi: profile.bca_bmi ? `${profile.bca_bmi}` : '',
          bodyFat: profile.bca_bodyFat_percent ? `${profile.bca_bodyFat_percent}` : '',
          muscleMassKg: profile.bca_muscleMass_kg ? `${profile.bca_muscleMass_kg}` : '',
          muscleMassPercent: profile.bca_muscleMass_percent ? `${profile.bca_muscleMass_percent}` : '',
          subcutaneousFat: profile.bca_subcutaneousFat_percent ? `${profile.bca_subcutaneousFat_percent}` : '',
          visceralFat: profile.bca_visceralFat_level ? `${profile.bca_visceralFat_level}` : '',
          bodyAge: profile.bca_bodyAge_years ? `${profile.bca_bodyAge_years}` : '',
          bmr: profile.bca_bmr_kcal ? `${profile.bca_bmr_kcal}` : '',
          skeletalMass: profile.bca_skeletalMass_kg ? `${profile.bca_skeletalMass_kg}` : '',
          boneMass: profile.bca_boneMass_kg ? `${profile.bca_boneMass_kg}` : '',
          protein: profile.bca_protein_kg ? `${profile.bca_protein_kg}` : '',
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile. Please try again.');
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      const response = await updateClientProfile(userId, {
        name: userDetails.name,
        email: userDetails.email,
        height_cm: userDetails.height ? parseFloat(userDetails.height) : null,
        weight_kg: userDetails.weight ? parseFloat(userDetails.weight) : null,
      });

      if (response.code === '100') {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userId', 'userData', 'userRole', 'userBranch']);
    setShowLogoutConfirm(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'OTP' }],
    });
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
        <Text style={AppStyles.detailValue}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  const renderEditableDetailRow = (label: string, value: string, onChangeText: (text: string) => void, placeholder?: string, editable: boolean = true) => (
    <View style={AppStyles.modernDetailRow}>
      <View style={AppStyles.detailRowHeader}>
        <Text style={AppStyles.detailLabel}>{label}</Text>
      </View>
      <View style={AppStyles.inputContainer}>
        <TextInput
          style={[AppStyles.modernInput, !editable && { opacity: 0.6 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          placeholderTextColor={colors.mediumGray}
          editable={editable}
        />
      </View>
    </View>
  );

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
      <View style={AppStyles.profileHeader}>
        <View style={AppStyles.avatarContainer}>
          <Image source={require('../images/logo.png')} style={AppStyles.profileAvatar} />
        </View>
        <Text style={AppStyles.profileName}>{userDetails.name || 'Guest User'}</Text>
        <Text style={AppStyles.profileSubtitle}>{userDetails.branchName || 'Fitness Enthusiast'}</Text>
        <View style={AppStyles.profileStats}>
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{userDetails.weight ? `${userDetails.weight} kg` : 'N/A'}</Text>
            <Text style={AppStyles.statLabel}>Weight</Text>
          </View>
          <View style={AppStyles.statDivider} />
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{userDetails.height ? `${userDetails.height} cm` : 'N/A'}</Text>
            <Text style={AppStyles.statLabel}>Height</Text>
          </View>
          <View style={AppStyles.statDivider} />
          <View style={AppStyles.statItem}>
            <Text style={AppStyles.statValue}>{bca.bmi || 'N/A'}</Text>
            <Text style={AppStyles.statLabel}>BMI</Text>
          </View>
        </View>
      </View>

      {renderModernCard(
        'Personal Information',
        <>
          {renderEditableDetailRow('Full Name', userDetails.name, (text) => setUserDetails({ ...userDetails, name: text }))}
          {renderEditableDetailRow('Email', userDetails.email, (text) => setUserDetails({ ...userDetails, email: text }))}
          {renderEditableDetailRow('Mobile Number', userDetails.phone, () => {}, '', false)}
          {renderEditableDetailRow('Height (cm)', userDetails.height, (text) => setUserDetails({ ...userDetails, height: text }))}
          {renderEditableDetailRow('Weight (kg)', userDetails.weight, (text) => setUserDetails({ ...userDetails, weight: text }))}
        </>,
        'user'
      )}

      {renderModernCard(
        'Body Measurements',
        <>
          <View style={AppStyles.measurementsGrid}>
            {renderDetailRow('Chest', measurements.chest ? `${measurements.chest} cm` : '', 'arrows-h')}
            {renderDetailRow('Upper Waist', measurements.upperWaist ? `${measurements.upperWaist} cm` : '', 'arrows-h')}
            {renderDetailRow('Mid Waist', measurements.midWaist ? `${measurements.midWaist} cm` : '', 'arrows-h')}
            {renderDetailRow('Lower Waist', measurements.lowerWaist ? `${measurements.lowerWaist} cm` : '', 'arrows-h')}
            {renderDetailRow('Right Thigh', measurements.rightThigh ? `${measurements.rightThigh} cm` : '', 'arrows-h')}
            {renderDetailRow('Left Thigh', measurements.leftThigh ? `${measurements.leftThigh} cm` : '', 'arrows-h')}
            {renderDetailRow('Right Arm', measurements.rightArm ? `${measurements.rightArm} cm` : '', 'arrows-h')}
            {renderDetailRow('Left Arm', measurements.leftArm ? `${measurements.leftArm} cm` : '', 'arrows-h')}
          </View>
          <Text style={{ color: colors.mediumGray, fontSize: 12, marginTop: 10, textAlign: 'center' }}>
            Measurements are updated by your trainer
          </Text>
        </>,
        'male'
      )}

      {renderModernCard(
        'Body Composition Analysis (BCA)',
        <>
          <View style={AppStyles.bcaGrid}>
            {renderDetailRow('Weight', bca.weight ? `${bca.weight} kg` : '', 'balance-scale')}
            {renderDetailRow('BMI', bca.bmi, 'calculator')}
            {renderDetailRow('Body Fat', bca.bodyFat ? `${bca.bodyFat}%` : '', 'percent')}
            {renderDetailRow('Muscle Mass', bca.muscleMassKg ? `${bca.muscleMassKg} kg` : '', 'child')}
          </View>
          <View style={AppStyles.bcaGrid}>
            {renderDetailRow('Subcutaneous Fat', bca.subcutaneousFat ? `${bca.subcutaneousFat}%` : '', 'tint')}
            {renderDetailRow('Visceral Fat', bca.visceralFat, 'heartbeat')}
            {renderDetailRow('Body Age', bca.bodyAge ? `${bca.bodyAge} yrs` : '', 'user')}
            {renderDetailRow('BMR', bca.bmr ? `${bca.bmr} kcal` : '', 'fire')}
          </View>
          <View style={AppStyles.bcaGrid}>
            {renderDetailRow('Skeletal Mass', bca.skeletalMass ? `${bca.skeletalMass} kg` : '', 'anchor')}
            {renderDetailRow('Bone Mass', bca.boneMass ? `${bca.boneMass} kg` : '', 'medkit')}
            {renderDetailRow('Protein', bca.protein ? `${bca.protein} kg` : '', 'flask')}
            {renderDetailRow('Muscle %', bca.muscleMassPercent ? `${bca.muscleMassPercent}%` : '', 'line-chart')}
          </View>
          <Text style={{ color: colors.mediumGray, fontSize: 12, marginTop: 10, textAlign: 'center' }}>
            BCA data synced from ActiveX machine
          </Text>
        </>,
        'heartbeat'
      )}

      <View style={AppStyles.profileActions}>
        <TouchableOpacity
          style={[AppStyles.primaryButton, saving && { opacity: 0.6 }]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.lightGray} size="small" />
          ) : (
            <>
              <Icon name="save" size={16} color={colors.lightGray} style={AppStyles.buttonIcon} />
              <Text style={AppStyles.primaryButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.secondaryButton} onPress={() => setShowLogoutConfirm(true)}>
          <Icon name="sign-out" size={16} color={colors.red} style={AppStyles.buttonIcon} />
          <Text style={AppStyles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
              <TouchableOpacity style={AppStyles.cancelButton} onPress={() => setShowLogoutConfirm(false)}>
                <Text style={AppStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={AppStyles.confirmButton} onPress={handleLogout}>
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
