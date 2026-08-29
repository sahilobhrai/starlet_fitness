import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Modal, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpcomingBookingsScreen from './UpcomingBookingsScreen';
import SessionHistoryScreen from './SessionHistoryScreen';
import EarningsAndPayoutsScreen from './EarningsAndPayoutsScreen';
import SlotManagementScreen from './SlotManagementScreen';
import { getTrainerDashboard } from '../api';

const { width } = Dimensions.get('window');

interface TrainerDashboardScreenProps {
  navigation: any;
}

interface DashboardData {
  trainer_name: string;
  total_clients: number;
  upcoming_sessions: number;
  today_sessions: any[];
  total_earnings: number;
}

const TrainerDashboardScreen = ({ navigation }: TrainerDashboardScreenProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    trainer_name: '',
    total_clients: 0,
    upcoming_sessions: 0,
    today_sessions: [],
    total_earnings: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setTrainerId(userId);

      if (userId) {
        const response = await getTrainerDashboard(userId);
        console.log('Trainer Dashboard Response:', response);

        if (response.code === '100' && response.dashboard) {
          setDashboardData(response.dashboard);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateAndCloseMenu = (screenName: string) => {
    navigation.navigate(screenName);
    setMenuVisible(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (loading) {
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.red} />
              <Text style={{ color: colors.lightGray, marginTop: 10 }}>Loading dashboard...</Text>
            </View>
          );
        }

        return (
          <ScrollView style={styles.dashboardContainer} contentContainerStyle={styles.dashboardContent}>
            <LinearGradient
              colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
              style={styles.welcomeHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.welcomeTitle}>Welcome back,</Text>
              <Text style={styles.trainerName}>{dashboardData.trainer_name || 'Trainer'}</Text>
              <Text style={styles.trainerSpecialty}>Fitness Trainer</Text>
            </LinearGradient>

            <View style={styles.statsContainer}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a52']}
                style={styles.statCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="users" size={30} color="#fff" />
                <Text style={styles.statNumber}>{dashboardData.total_clients}</Text>
                <Text style={styles.statLabel}>Total Clients</Text>
              </LinearGradient>

              <LinearGradient
                colors={['#4ecdc4', '#44a08d']}
                style={styles.statCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="calendar-check-o" size={30} color="#fff" />
                <Text style={styles.statNumber}>{dashboardData.upcoming_sessions}</Text>
                <Text style={styles.statLabel}>Upcoming Sessions</Text>
              </LinearGradient>
            </View>

            {/* Today's Sessions */}
            {dashboardData.today_sessions && dashboardData.today_sessions.length > 0 && (
              <View style={styles.todayContainer}>
                <Text style={styles.sectionTitle}>Today's Sessions</Text>
                {dashboardData.today_sessions.map((session: any, index: number) => (
                  <View key={index} style={styles.sessionCard}>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionClient}>{session.customer_name}</Text>
                      <Text style={styles.sessionTime}>
                        {new Date(session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: session.status === 'Scheduled' ? '#4ecdc4' : '#f5576c' }]}>
                      <Text style={styles.statusText}>{session.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>

              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('QRScanner')}>
                <LinearGradient
                  colors={['#56ab2f', '#a8e063']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="qrcode" size={25} color="#fff" />
                  <Text style={styles.actionTitle}>Scan QR</Text>
                  <Text style={styles.actionSubtitle}>Check in a client's session</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('bookings')}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="calendar-plus-o" size={25} color="#fff" />
                  <Text style={styles.actionTitle}>Upcoming Bookings</Text>
                  <Text style={styles.actionSubtitle}>View scheduled sessions</Text>
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

            <View style={styles.overviewContainer}>
              <Text style={styles.sectionTitle}>Performance Overview</Text>

              <View style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceTitle}>Your Stats</Text>
                  <Icon name="bar-chart" size={20} color={colors.lightGray} />
                </View>

                <View style={styles.performanceStats}>
                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceValue}>{dashboardData.total_clients}</Text>
                    <Text style={styles.performanceLabel}>Clients</Text>
                  </View>

                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceValue}>{dashboardData.upcoming_sessions}</Text>
                    <Text style={styles.performanceLabel}>Upcoming</Text>
                  </View>

                  <View style={styles.performanceItem}>
                    <Text style={styles.performanceValue}>₹{dashboardData.total_earnings.toLocaleString()}</Text>
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
      case 'slots':
        return <SlotManagementScreen navigation={navigation} />;
      default:
        return null;
    }
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userId', 'userData', 'userRole', 'userBranch']);
      setMenuVisible(false);
      setShowLogoutConfirm(false);
      navigation.replace('OTP');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

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

      <View style={AppStyles.bottomNav}>
        <TouchableOpacity style={AppStyles.bottomNavButton} onPress={() => setActiveTab('dashboard')}>
          <Icon name="home" size={24} color={activeTab === 'dashboard' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'dashboard' && AppStyles.bottomNavTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.bottomNavButton} onPress={() => setActiveTab('bookings')}>
          <Icon name="calendar-check-o" size={24} color={activeTab === 'bookings' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'bookings' && AppStyles.bottomNavTextActive]}>
            Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.bottomNavButton} onPress={() => setActiveTab('history')}>
          <Icon name="history" size={24} color={activeTab === 'history' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'history' && AppStyles.bottomNavTextActive]}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.bottomNavButton} onPress={() => setActiveTab('earnings')}>
          <Icon name="money" size={24} color={activeTab === 'earnings' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'earnings' && AppStyles.bottomNavTextActive]}>
            Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={AppStyles.bottomNavButton} onPress={() => setActiveTab('slots')}>
          <Icon name="th" size={24} color={activeTab === 'slots' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'slots' && AppStyles.bottomNavTextActive]}>
            Slots
          </Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={isMenuVisible} onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={AppStyles.menuOverlay} activeOpacity={1} onPressOut={() => setMenuVisible(false)}>
          <View style={AppStyles.menuContainer}>
            <TouchableOpacity style={AppStyles.menuItem} onPress={() => navigateAndCloseMenu('Settings')}>
              <Icon name="cog" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={AppStyles.menuItem} onPress={() => navigateAndCloseMenu('LocateUs')}>
              <Icon name="map-marker" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Locate Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={AppStyles.menuItem} onPress={() => navigateAndCloseMenu('Help')}>
              <Icon name="question-circle" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={AppStyles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Profile'); }}>
              <Icon name="user" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={AppStyles.menuItem} onPress={() => setShowLogoutConfirm(true)}>
              <Icon name="sign-out" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showLogoutConfirm} transparent={true} animationType="fade">
        <View style={AppStyles.modalContainer}>
          <View style={AppStyles.modalContent}>
            <Icon name="sign-out" size={60} color={colors.red} />
            <Text style={AppStyles.modalTitle}>Confirm Logout</Text>
            <Text style={AppStyles.modalText}>Are you sure you want to log out?</Text>
            <View style={AppStyles.modalButtonContainer}>
              <TouchableOpacity style={[AppStyles.modalButton, AppStyles.modalButtonCancel]} onPress={() => setShowLogoutConfirm(false)}>
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
  dashboardContainer: { flex: 1, backgroundColor: colors.black },
  dashboardContent: { paddingBottom: 100 },
  welcomeHeader: { margin: 15, padding: 20, borderRadius: 15, alignItems: 'center' },
  welcomeTitle: { fontSize: 16, color: colors.lightGray, marginBottom: 5 },
  trainerName: { fontSize: 28, fontWeight: 'bold', color: colors.lightGray, marginBottom: 5 },
  trainerSpecialty: { fontSize: 16, color: colors.mediumGray },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 15, marginBottom: 20 },
  statCard: { width: '45%', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 8 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 5 },
  statLabel: { fontSize: 14, color: '#fff', textAlign: 'center', fontWeight: '500' },
  todayContainer: { marginHorizontal: 15, marginBottom: 20 },
  sessionCard: { backgroundColor: colors.darkGray, borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionInfo: { flex: 1 },
  sessionClient: { color: colors.lightGray, fontSize: 16, fontWeight: 'bold' },
  sessionTime: { color: colors.mediumGray, fontSize: 14, marginTop: 5 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  actionsContainer: { marginHorizontal: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.lightGray, marginBottom: 15, paddingHorizontal: 5 },
  actionCard: { marginBottom: 15, borderRadius: 15, overflow: 'hidden', elevation: 5 },
  actionGradient: { padding: 20, alignItems: 'center' },
  actionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 5 },
  actionSubtitle: { fontSize: 14, color: '#fff', textAlign: 'center', opacity: 0.9 },
  overviewContainer: { marginHorizontal: 15, marginBottom: 20 },
  performanceCard: { backgroundColor: colors.darkGray, borderRadius: 15, padding: 20, elevation: 5 },
  performanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  performanceTitle: { fontSize: 18, fontWeight: 'bold', color: colors.lightGray },
  performanceStats: { flexDirection: 'row', justifyContent: 'space-around' },
  performanceItem: { alignItems: 'center', flex: 1 },
  performanceValue: { fontSize: 24, fontWeight: 'bold', color: colors.lightGray, marginBottom: 5 },
  performanceLabel: { fontSize: 12, color: colors.mediumGray, textAlign: 'center' },
  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 20 },
  card: { backgroundColor: colors.white, borderRadius: 10, padding: 20, alignItems: 'center', justifyContent: 'center', width: '45%', marginBottom: 20, elevation: 3 },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
});

export default TrainerDashboardScreen;
