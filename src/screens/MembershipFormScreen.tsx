import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

const membershipForm = require('../assets/membership_form.pdf');

interface MembershipFormScreenProps {
  navigation: any;
  route: any;
}

const MembershipFormScreen = ({ navigation, route }: MembershipFormScreenProps) => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const nextScreen = route?.params?.nextScreen || 'MainApp';

  const handleContinue = async () => {
    if (!agreed) return;
    await AsyncStorage.setItem('membershipFormAccepted', 'true');
    navigation.replace(nextScreen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membership Form</Text>
      <Text style={styles.subtitle}>
        Please read the membership terms below before continuing.
      </Text>

      <View style={styles.pdfContainer}>
        {loading && !error && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.lightGreen}
          />
        )}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Unable to load the membership form. Please contact support.
            </Text>
          </View>
        ) : (
          <Pdf
            source={membershipForm}
            style={styles.pdf}
            trustAllCerts={false}
            onLoadComplete={() => setLoading(false)}
            onError={(err) => {
              console.error('Membership form PDF load error:', err);
              setLoading(false);
              setError(true);
            }}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setAgreed((prev) => !prev)}
        activeOpacity={0.7}
      >
        <Icon
          name={agreed ? 'check-square' : 'square-o'}
          size={24}
          color={agreed ? colors.lightGreen : colors.lightGray}
        />
        <Text style={styles.checkboxLabel}>
          I have read and agree to the Membership Terms & Conditions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.continueButton, !agreed && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!agreed}
      >
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.lightGray,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.mediumGray,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  pdfContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.darkGray,
  },
  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.darkGray,
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.lightGray,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 10,
    color: colors.lightGray,
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: colors.lightGreen,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: colors.darkGray,
  },
  continueButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default MembershipFormScreen;
