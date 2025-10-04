import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Modal, Image } from 'react-native'; // Removed BackHandler
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import UpcomingBookingsScreen from './UpcomingBookingsScreen'; // Import UpcomingBookingsScreen
import SessionHistoryScreen from './SessionHistoryScreen'; // Import SessionHistoryScreen
import EarningsAndPayoutsScreen from './EarningsAndPayoutsScreen'; // Import EarningsAndPayoutsScreen

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
          <ScrollView style={styles.dashboardContainer} contentContainerStyle={styles.dashboardContent}>
            {/* Welcome Header */}
            <LinearGradient
              colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
              style={styles.welcomeHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.welcomeTitle}>Welcome back,</Text>
              <Text style={styles.trainerName}>{trainer.name}</Text>
              <Text style={styles.trainerSpecialty}>{trainer.specialty}</Text>
            </LinearGradient>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a52']}
                style={styles.statCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="users" size={30} color="#fff" />
                <Text style={styles.statNumber}>{trainer.clients}</Text>
                <Text style={styles.statLabel}>Total Clients</Text>
              </LinearGradient>

              <LinearGradient
                colors={['#4ecdc4', '#44a08d']}
                style={styles.statCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="calendar-check-o" size={30} color="#fff" />
                <Text style={styles.statNumber}>{trainer.upcomingSessions}</Text>
                <Text style={styles.statLabel}>Upcoming Sessions</Text>
              </LinearGradient>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>

              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('UpcomingBookings')}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="calendar-plus-o" size={25} color="#fff" />
                  <Text style={styles.actionTitle}>Book Session</Text>
                  <Text style={styles.actionSubtitle}>Schedule new training sessions</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('history')}>
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="history" size={25} color="#fff" />
                  <Text style={styles.actionTitle}>Session History</Text>
                  <Text style={styles.actionSubtitle}>View past training sessions</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('earnings')}>
                <LinearGradient
                  colors={['#ffecd2', '#fcb69f']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="money" size={25} color="#333" />
                  <Text style={[styles.actionTitle, { color: '#333' }]}>Earnings</Text>
                  <Text style={[styles.actionSubtitle, { color: '#666' }]}>Track your income</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Performance Overview */}
            <View style={styles.overviewContainer}>
              <Text style={styles.sectionTitle}>Performance Overview</Text>

              <View style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceTitle}>This Month</Text>
                  <Icon name="bar-chart" size={20} color={colors.lightGray} />
                </View>

                <View style={styles.performanceStats}>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceValue}>24</Text>
                    <Text style={styles.performanceLabel}>Sessions Completed</Text>
                  </View>

                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceValue}>98%</Text>
                    <Text style={styles.performanceLabel}>Client Satisfaction</Text>
                  </View>

                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceValue}>₹12,500</Text>
                    <Text style={styles.performanceLabel}>Total Earnings</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case 'bookings':
        return <UpcomingBookingsScreen navigation={navigation} />;
      case 'history':
        return <SessionHistoryScreen navigation={navigation} />;
      case 'earnings':
        return <EarningsAndPayoutsScreen />;
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
            <Icon name="sign-out" size={60} color={colors.red} />
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
  // Legacy styles for fallback
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

  // Modern Dashboard Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  dashboardContent: {
    paddingBottom: 100,
  },

  // Welcome Header
  welcomeHeader: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 16,
    color: colors.lightGray,
    marginBottom: 5,
  },
  trainerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginBottom: 5,
  },
  trainerSpecialty: {
    fontSize: 16,
    color: colors.mediumGray,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    width: '45%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Quick Actions
  actionsContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  actionCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },

  // Performance Overview
  overviewContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  performanceCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightGray,
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginBottom: 5,
  },
  performanceLabel: {
    fontSize: 12,
    color: colors.mediumGray,
    textAlign: 'center',
  },
});

export default TrainerDashboardScreen;
