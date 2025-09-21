import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native'; // Added Image
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import Notification from '../components/Notification'; // Import the Notification component
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Import the logo
import logo from '../images/logo_main.png'; // Assuming logo.png is the correct file

const { width } = Dimensions.get('window');

// OTP Authentication Component
interface OTPScreenProps {
  navigation: any;
}

const OTPScreen = ({ navigation }: OTPScreenProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [mobile, setMobile] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showOtpSection, setShowOtpSection] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const inputRefs = useRef<TextInput[]>([]);
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp]);

  const focusNext = (index: number, value: string) => {
    if (index < inputRefs.current.length - 1 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const focusPrevious = (index: number, key: string) => {
    if (key === 'Backspace' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    focusNext(index, text);
  };

  const handleVerify = async () => { // Made function async
    const enteredOtp = otp.join('');
    const correctOtp = '1234'; // Hardcoded OTP for all roles for now

    if (enteredOtp === correctOtp) {
      setNotification({ message: 'OTP Verified! Redirecting to dashboard...', type: 'success', isVisible: true });
      // Save the user token to AsyncStorage
      try {
        await AsyncStorage.setItem('userToken', 'dummy-user-token'); // Replace with actual token generation if needed
      } catch (error) {
        console.error('Error saving token to AsyncStorage', error);
        setNotification({ message: 'Error saving login status.', type: 'error', isVisible: true });
        return; // Stop execution if saving fails
      }

      let destinationScreen = 'MainApp'; // Default for user
      let userRole = 'user'; // Default role

      // Simulate user type based on mobile number for demonstration
      if (mobile === '2222222222') {
        destinationScreen = 'TrainerDashboard';
        userRole = 'trainer';
      } else if (mobile === '3333333333') {
        destinationScreen = 'OwnerDashboard';
        userRole = 'owner';
      }
      // For any other mobile number, it will default to 'MainApp' (user)

      // Store the user role in AsyncStorage
      try {
        await AsyncStorage.setItem('userRole', userRole);
      } catch (error) {
        console.error('Error saving user role to AsyncStorage', error);
        setNotification({ message: 'Error saving user role.', type: 'error', isVisible: true });
        return;
      }

      setTimeout(() => {
        navigation.replace(destinationScreen); // Navigate to respective screen
      }, 1000);
    } else {
      setNotification({ message: 'Incorrect OTP. Please try again.', type: 'error', isVisible: true });
      // No navigation on failure, stay on OTP screen
    }
  };

  const handleNext = () => {
    if (mobile.length === 10) {
      setShowOtpSection(true);
      setNotification({ message: 'OTP sent to your mobile number.', type: 'info', isVisible: true });
    }
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <View style={AppStyles.otpScreenContainer}>
      <View style={AppStyles.otpOverlay}>
        <View style={AppStyles.otpContainer}>
          <Image
            source={logo}
            style={AppStyles.logo} // Assuming a style for the logo will be defined in AppStyles
            resizeMode="contain"
          />
          <Text style={AppStyles.otpTitle}>MOBILE AUTHENTICATION</Text>
          <Text style={AppStyles.otpSubtitle}>Please enter the mobile number linked with WhatsApp.</Text>

          <View style={AppStyles.mobileInputContainer}>
            <Text style={AppStyles.countryCode}>+91</Text>
            <TextInput
              style={AppStyles.mobileInput}
              placeholder="Enter your mobile number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text);
                setShowOtpSection(false);
                setNotification((prev) => ({ ...prev, isVisible: false })); // Hide notification if mobile number changes
              }}
              maxLength={10}
            />
          </View>

          {!showOtpSection && mobile.length === 10 && (
            <TouchableOpacity
              style={AppStyles.nextButton}
              onPress={handleNext}
            >
              <Text style={AppStyles.nextButtonText}>NEXT</Text>
            </TouchableOpacity>
          )}

          {showOtpSection && (
            <>
              <Text style={AppStyles.otpLabel}>ENTER 4-DIGIT OTP</Text>
              <View style={AppStyles.otpInputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={[
                      AppStyles.otpInput,
                      focusedIndex === index && AppStyles.otpInputFocused
                    ]}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={({ nativeEvent: { key } }) => focusPrevious(index, key)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(-1)}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={(ref) => {
                      if (ref) {
                        inputRefs.current[index] = ref;
                      }
                    }}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[
                  AppStyles.verifyButton,
                  (otp.join('').length !== 4 || mobile.length !== 10) && AppStyles.verifyButtonDisabled
                ]}
                onPress={handleVerify}
                disabled={otp.join('').length !== 4 || mobile.length !== 10}
              >
                <Text style={AppStyles.verifyButtonText}>VERIFY OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={AppStyles.resendContainer}>
                <Text style={AppStyles.resendText}>Didn't receive OTP? </Text>
                <Text style={AppStyles.resendLink}>Resend</Text>
              </TouchableOpacity>

              <Text style={AppStyles.privacyPolicyText}>
                By continuing, you agree to our Privacy Policy and Terms of Service.
              </Text>
            </>
          )}
        </View>
      </View>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        isVisible={notification.isVisible}
      />
    </View>
  );
};

export default OTPScreen;
