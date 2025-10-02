import React, { useState, useEffect, useRef } from 'react'; // Added useState, useEffect, useRef
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Animated } from 'react-native'; // Import Animated
import { colors } from '../theme/colors'; // Import colors

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import IntroductionScreen from '../screens/IntroductionScreen';
import OTPScreen from '../screens/OTPScreen';
import MainAppContent from '../screens/MainAppContent';
import ProfileScreen from '../screens/ProfileScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LocateUsScreen from '../screens/LocateUsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import TrainerDashboardScreen from '../screens/TrainerDashboardScreen';
import AssignedSessionsScreen from '../screens/AssignedSessionsScreen';
import UpcomingBookingsScreen from '../screens/UpcomingBookingsScreen';
import OwnerDashboardScreen from '../screens/OwnerDashboardScreen';
import SessionHistoryScreen from '../screens/SessionHistoryScreen'; // Import SessionHistoryScreen
import EarningsAndPayoutsScreen from '../screens/EarningsAndPayoutsScreen'; // Import EarningsAndPayoutsScreen

// Import newly created screens
import DashboardScreen from '../screens/DashboardScreen';
import ManageBranchesScreen from '../screens/ManageBranchesScreen';
import ManageTrainersScreen from '../screens/ManageTrainersScreen';
import ManageCustomersScreen from '../screens/ManageCustomersScreen';
import ReportsScreen from '../screens/ReportsScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [initialRoute, setInitialRoute] = useState('Splash'); // State to manage initial route
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity 1

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userRole = await AsyncStorage.getItem('userRole'); // Retrieve user role

        if (userToken) {
          // User is authenticated, determine initial route based on role
          if (userRole === 'trainer') {
            setInitialRoute('TrainerDashboard');
          } else if (userRole === 'owner') {
            setInitialRoute('OwnerDashboard');
          } else {
            // Default to MainApp for regular users or if role is not specified
            setInitialRoute('MainApp');
          }
        } else {
          // Not authenticated, go to Intro screen
          setInitialRoute('Intro');
        }
      } catch (error) {
        console.error('Error reading token or role from AsyncStorage', error);
        setInitialRoute('Intro'); // Fallback to Intro on error
      } finally {
        // Start fade out animation after 1.5 seconds, then set isLoading to false
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, // Fade out duration
          delay: 1500, // Start fade out after 1.5 seconds (total 2 seconds splash)
          useNativeDriver: true,
        }).start(() => setIsLoading(false));
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Render SplashScreen with fade out animation
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: colors.black }}>
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute} // Set initial route based on state
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Intro" component={IntroductionScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="MainApp" component={MainAppContent} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="LocateUs" component={LocateUsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        <Stack.Screen name="TrainerDashboard" component={TrainerDashboardScreen} />
        <Stack.Screen name="AssignedSessions" component={AssignedSessionsScreen} />
        <Stack.Screen name="UpcomingBookings" component={UpcomingBookingsScreen} />
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
        <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
        <Stack.Screen name="EarningsAndPayouts" component={EarningsAndPayoutsScreen} />

        {/* Add new screens to the navigator */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ManageBranches" component={ManageBranchesScreen} />
        <Stack.Screen name="ManageTrainers" component={ManageTrainersScreen} />
        <Stack.Screen name="ManageCustomers" component={ManageCustomersScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Invoices" component={InvoicesScreen} />
        <Stack.Screen name="Announcements" component={AnnouncementsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
