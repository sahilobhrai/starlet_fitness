import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native'; // Added Image
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import Notification from '../components/Notification'; // Import the Notification component
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { sendOtp, verifyOtp } from '../api/index'; // Import the sendOtp function
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

  const handleVerify = async () => {
    try {
      console.log('=== VERIFY OTP START ===');
      console.log('Mobile:', mobile);
      console.log('OTP:', otp.join(''));

      const resp = await verifyOtp(mobile, otp.join(''));
      console.log('Verify OTP Response:', resp);

      if (resp.success) {
        setNotification({ message: 'OTP Verified! Redirecting to dashboard...', type: 'success', isVisible: true });
        try {

          const token = resp.tokens.accessToken;
          console.log('Storing user token in AsyncStorage:', token);
          await AsyncStorage.setItem('userToken', token);
          // Save userId for session booking
          console.log("whole data is ", resp.user);
          console.log('Storing user ID in AsyncStorage:', resp.user.id);
          await AsyncStorage.setItem('userId', String(resp.user.id));
        } catch (error) {
          console.error('Error saving token to AsyncStorage', error);
          setNotification({ message: 'Error saving login status.', type: 'error', isVisible: true });
          return;
        }

        let destinationScreen = 'MainApp';
        let userRole = 'user';
        if (resp.user.isTrainer) {
          destinationScreen = 'TrainerDashboard';
          userRole = 'trainer';
        } else if (resp.user.isAdmin) {
          destinationScreen = 'OwnerDashboard';
          userRole = 'owner';
        }
        try {
          await AsyncStorage.setItem('userRole', userRole);
        } catch (error) {
          console.error('Error saving user role to AsyncStorage', error);
          setNotification({ message: 'Error saving user role.', type: 'error', isVisible: true });
          return;
        }

        setTimeout(() => {
          navigation.replace(destinationScreen);
        }, 1000);
      } else if (resp && resp.error) {
        console.error('OTP Verification Error:', resp.error);
        setNotification({ message: resp.error, type: 'error', isVisible: true });
      } else {
        console.error('Unexpected response format:', resp);
        setNotification({ message: 'Incorrect OTP. Please try again.', type: 'error', isVisible: true });
      }
    } catch (error) {
      console.error('=== VERIFY OTP EXCEPTION ===');
      console.error('Error:', error);
      setNotification({ message: 'Error verifying OTP. Please try again later.', type: 'error', isVisible: true });
    }
  };

  const handleNext = async () => {
    if (mobile.length === 10) {
      try {
        console.log('=== SEND OTP START ===');
        console.log('Mobile number:', mobile);

        const resp = await sendOtp(mobile);
        console.log('=== SEND OTP RESPONSE ===');
        console.log('Response:', JSON.stringify(resp, null, 2));

        if (resp && resp.error) {
          console.error('OTP Send Error:', resp.error);
          setNotification({ message: resp.error, type: 'error', isVisible: true });
          setShowOtpSection(false);
          return;
        }

        if (resp && resp.success) {
          console.log('OTP sent successfully');
          setShowOtpSection(true);
          setNotification({ message: 'OTP sent to your mobile number.', type: 'success', isVisible: true });
        } else {
          console.error('Unexpected response format:', resp);
          setNotification({ message: 'Failed to send OTP. Please try again.', type: 'error', isVisible: true });
          setShowOtpSection(false);
        }
      } catch (error) {
        console.error('=== SEND OTP EXCEPTION ===');
        console.error('Error:', error);
        setNotification({ message: 'Error sending OTP. Please try again.', type: 'error', isVisible: true });
        setShowOtpSection(false);
      }
    } else {
      console.log('Invalid mobile number length:', mobile.length);
      setNotification({ message: 'Please enter a valid 10-digit mobile number.', type: 'error', isVisible: true });
    }
  }

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
