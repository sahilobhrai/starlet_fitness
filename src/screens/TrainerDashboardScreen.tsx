import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Modal, Image } from 'react-native'; // Removed BackHandler
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import UpcomingBookingsScreen from './UpcomingBookingsScreen'; // Import UpcomingBookingsScreen
import SessionHistoryScreen from './SessionHistoryScreen'; // Import SessionHistoryScreen

const { width } = Dimensions.get('window');

interface TrainerDashboardScreenProps {
  navigation: any;
}

const TrainerDashboardScreen = ({ navigation }: TrainerDashboardScreenProps) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // New state for active tab
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // New state for confirmation modal

  const trainer = {
    name: 'Jane Smith',
    specialty: 'Strength & Conditioning',
    clients: 12,
    upcomingSessions: 7,
  };

  const navigateAndCloseMenu = (screenName: string) => {
    navigation.navigate(screenName);
    setMenuVisible(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ScrollView style={AppStyles.profileContainer} contentContainerStyle={AppStyles.profileContentContainer}>
            <Text style={AppStyles.sectionTitle}>TRAINER DASHBOARD</Text>

            <View style={AppStyles.profileHeader}>
              <Icon name="user-circle" size={80} color={colors.primary} />
              <Text style={AppStyles.profileName}>{trainer.name}</Text>
              <Text style={AppStyles.profileAge}>{trainer.specialty}</Text>
            </View>

            <View style={AppStyles.profileDetailsContainer}>
              <View style={AppStyles.detailRow}>
                <Icon name="users" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Clients: <Text style={AppStyles.profileDetailBold}>{trainer.clients}</Text></Text>
              </View>
              <View style={AppStyles.detailRow}>
                <Icon name="calendar" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Upcoming Sessions: <Text style={AppStyles.profileDetailBold}>{trainer.upcomingSessions}</Text></Text>
              </View>
            </View>
          </ScrollView>
        );
      case 'bookings':
        return <UpcomingBookingsScreen navigation={navigation} />;
      case 'history':
        return <SessionHistoryScreen navigation={navigation} />;
      case 'earnings':
        return (
          <ScrollView style={AppStyles.profileContainer} contentContainerStyle={AppStyles.profileContentContainer}>
            <Text style={AppStyles.sectionTitle}>EARNINGS & PAYOUTS</Text>
            <View style={AppStyles.profileDetailsContainer}>
              <View style={AppStyles.detailRow}>
                <Icon name="money" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Track earnings per session</Text>
              </View>
              <View style={AppStyles.detailRow}>
                <Icon name="line-chart" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Monthly/weekly revenue breakdown</Text>
              </View>
            </View>
          </ScrollView>
        );
      default:
        return (
          <ScrollView style={AppStyles.profileContainer} contentContainerStyle={AppStyles.profileContentContainer}>
            <Text style={AppStyles.sectionTitle}>TRAINER DASHBOARD</Text>

            <View style={AppStyles.profileHeader}>
              <Icon name="user-circle" size={80} color={colors.primary} />
              <Text style={AppStyles.profileName}>{trainer.name}</Text>
              <Text style={AppStyles.profileAge}>{trainer.specialty}</Text>
            </View>

            <View style={AppStyles.profileDetailsContainer}>
              <View style={AppStyles.detailRow}>
                <Icon name="users" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Clients: <Text style={AppStyles.profileDetailBold}>{trainer.clients}</Text></Text>
              </View>
              <View style={AppStyles.detailRow}>
                <Icon name="calendar" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Upcoming Sessions: <Text style={AppStyles.profileDetailBold}>{trainer.upcomingSessions}</Text></Text>
              </View>
            </View>

            <View style={styles.cardContainer}>
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UpcomingBookings')}>
                <Icon name="calendar-check-o" size={30} color={colors.primary} />
                <Text style={styles.cardText}>Bookings & Sessions</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
    }
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Remove the user token
      await AsyncStorage.removeItem('userRole'); // Remove the user role
      setMenuVisible(false); // Close the menu
      setShowLogoutConfirm(false); // Hide the confirmation modal
      navigation.replace('Intro'); // Navigate to Intro screen
    } catch (error) {
      console.error('Error logging out', error);
      // Optionally show an error notification to the user
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Modified handleLogout to trigger the modal
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      {/* Custom Header */}
      <View style={AppStyles.customHeader}>
        <Image source={require('../images/logo_main.png')} style={AppStyles.headerLogo} />
        <View style={AppStyles.headerIcons}>
          <TouchableOpacity style={AppStyles.headerIcon} onPress={() => setMenuVisible(true)}>
            <Icon name="bars" size={24} color={colors.lightGray} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={AppStyles.mainContent}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={AppStyles.bottomNav}>
        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('dashboard')}
        >
          <Icon name="home" size={24} color={activeTab === 'dashboard' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'dashboard' && AppStyles.bottomNavTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('bookings')}
        >
          <Icon name="calendar-check-o" size={24} color={activeTab === 'bookings' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'bookings' && AppStyles.bottomNavTextActive]}>
            Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('history')}
        >
          <Icon name="history" size={24} color={activeTab === 'history' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'history' && AppStyles.bottomNavTextActive]}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('earnings')}
        >
          <Icon name="money" size={24} color={activeTab === 'earnings' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'earnings' && AppStyles.bottomNavTextActive]}>
            Earnings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hamburger Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={AppStyles.menuOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={AppStyles.menuContainer}>
            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={() => navigateAndCloseMenu('Settings')}
            >
              <Icon name="cog" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={() => navigateAndCloseMenu('LocateUs')}
            >
              <Icon name="map-marker" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Locate Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={() => navigateAndCloseMenu('Help')}
            >
              <Icon name="question-circle" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <Icon name="user" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            {/* Logout Button */}
            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={handleLogout} // Call handleLogout function
            >
              <Icon name="sign-out" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent={true}
        animationType="fade"
      >
        <View style={AppStyles.modalContainer}>
          <View style={AppStyles.modalContent}>
            <Text style={{ fontSize: 60, color: '#ff0000' }}>✓</Text> {/* Placeholder icon */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
});

export default TrainerDashboardScreen;
