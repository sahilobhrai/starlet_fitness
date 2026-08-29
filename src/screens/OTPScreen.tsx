import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Image, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import Notification from '../components/Notification';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp, resendOtp, verifyOtp } from '../api/index';
import logo from '../images/logo_main.png';

const { width } = Dimensions.get('window');

interface OTPScreenProps {
  navigation: any;
}

const OTPScreen = ({ navigation }: OTPScreenProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [mobile, setMobile] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showOtpSection, setShowOtpSection] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const inputRefs = useRef<TextInput[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendTimer]);

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

  const startResendTimer = () => {
    setResendTimer(30);
  };

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setNotification({ message: 'Please enter a valid 10-digit mobile number.', type: 'error', isVisible: true });
      return;
    }

    setIsLoading(true);
    try {
      const resp = await sendOtp(mobile);
      console.log('Send OTP Response:', resp);

      if (resp && resp.code === '100') {
        setNotification({ message: resp.message || 'OTP sent successfully.', type: 'success', isVisible: true });
        setShowOtpSection(true);
        startResendTimer();
      } else if (resp && resp.code === '400') {
        setNotification({ message: resp.error || 'Failed to send OTP.', type: 'error', isVisible: true });
      } else if (resp && resp.error) {
        setNotification({ message: resp.error, type: 'error', isVisible: true });
      } else {
        setNotification({ message: 'Something went wrong. Please try again.', type: 'error', isVisible: true });
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      setNotification({ message: 'Error sending OTP. Please try again later.', type: 'error', isVisible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const resp = await resendOtp(mobile);
      console.log('Resend OTP Response:', resp);

      if (resp && resp.code === '100') {
        setNotification({ message: resp.message || 'OTP resent successfully.', type: 'success', isVisible: true });
        setOtp(['', '', '', '']);
        startResendTimer();
      } else if (resp && resp.code === '400') {
        setNotification({ message: resp.error || 'Failed to resend OTP.', type: 'error', isVisible: true });
      } else if (resp && resp.error) {
        setNotification({ message: resp.error, type: 'error', isVisible: true });
      } else {
        setNotification({ message: 'Something went wrong. Please try again.', type: 'error', isVisible: true });
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      setNotification({ message: 'Error resending OTP. Please try again later.', type: 'error', isVisible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4 || mobile.length !== 10) {
      setNotification({ message: 'Please enter a valid 4-digit OTP.', type: 'error', isVisible: true });
      return;
    }

    setIsLoading(true);
    try {
      const resp = await verifyOtp(mobile, otpValue);
      console.log('Verify OTP Response:', resp);

      if (resp && resp.code === '100') {
        setNotification({ message: resp.message || 'OTP verified successfully.', type: 'success', isVisible: true });

        // Store access token
        const token = resp.access_token;
        if (token) {
          await AsyncStorage.setItem('userToken', token);
        }

        // Owner/Manager accounts don't have app access - they're managed via the Django admin portal
        const backendRole = resp.user?.role || 'CLIENT';
        if (backendRole === 'MANAGER') {
          setNotification({
            message: 'Manager and owner accounts do not have app access. Please use the admin portal instead.',
            type: 'error',
            isVisible: true,
          });
          setIsLoading(false);
          return;
        }

        // Store user data
        if (resp.user) {
          await AsyncStorage.setItem('userId', String(resp.user.id));
          await AsyncStorage.setItem('userData', JSON.stringify(resp.user));

          // Determine destination based on role (backend returns CLIENT/TRAINER)
          let destinationScreen = 'MainApp';
          let userRole = 'customer'; // default

          // Map backend roles to frontend roles
          if (backendRole === 'TRAINER' || backendRole === 'trainer') {
            userRole = 'trainer';
            destinationScreen = 'TrainerDashboard';
          } else {
            userRole = 'customer';
            destinationScreen = 'MainApp';
          }

          await AsyncStorage.setItem('userRole', userRole);

          if (resp.user.branch) {
            await AsyncStorage.setItem('userBranch', String(resp.user.branch));
          }

          // Customers must accept the membership form once before reaching MainApp
          if (userRole === 'customer') {
            const membershipFormAccepted = await AsyncStorage.getItem('membershipFormAccepted');
            if (!membershipFormAccepted) {
              destinationScreen = 'MembershipForm';
            }
          }

          setTimeout(() => {
            navigation.replace(destinationScreen);
          }, 1000);
        }
      } else if (resp && resp.code === '400') {
        setNotification({ message: resp.error || 'Invalid OTP or phone number.', type: 'error', isVisible: true });
      } else if (resp && resp.error) {
        setNotification({ message: resp.error, type: 'error', isVisible: true });
      } else {
        setNotification({ message: 'Incorrect OTP. Please try again.', type: 'error', isVisible: true });
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      setNotification({ message: 'Error verifying OTP. Please try again later.', type: 'error', isVisible: true });
    } finally {
      setIsLoading(false);
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
            style={AppStyles.logo}
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
                if (showOtpSection) {
                  setShowOtpSection(false);
                  setOtp(['', '', '', '']);
                  setResendTimer(0);
                }
                setNotification((prev) => ({ ...prev, isVisible: false }));
              }}
              maxLength={10}
              editable={!isLoading}
            />
          </View>

          {!showOtpSection && mobile.length === 10 && (
            <TouchableOpacity
              style={[AppStyles.nextButton, isLoading && AppStyles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.lightGray} size="small" />
              ) : (
                <Text style={AppStyles.nextButtonText}>SEND OTP</Text>
              )}
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
                    editable={!isLoading}
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
                  (otp.join('').length !== 4 || mobile.length !== 10 || isLoading) && AppStyles.verifyButtonDisabled
                ]}
                onPress={handleVerify}
                disabled={otp.join('').length !== 4 || mobile.length !== 10 || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.lightGray} size="small" />
                ) : (
                  <Text style={AppStyles.verifyButtonText}>VERIFY OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={AppStyles.resendContainer}
                onPress={handleResendOtp}
                disabled={resendTimer > 0 || isLoading}
              >
                <Text style={AppStyles.resendText}>Didn't receive OTP? </Text>
                {resendTimer > 0 ? (
                  <Text style={AppStyles.resendTimerText}>Resend in {resendTimer}s</Text>
                ) : (
                  <Text style={AppStyles.resendLink}>Resend</Text>
                )}
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
