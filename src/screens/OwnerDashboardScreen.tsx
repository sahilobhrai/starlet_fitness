import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Modal, Image } from 'react-native'; // Removed BackHandler
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

// Import the new screens for admin dashboard
import DashboardScreen from './DashboardScreen'; // Assuming this is the main dashboard overview
import ManageBranchesScreen from './ManageBranchesScreen'; // Import ManageBranchesScreen
import ManageTrainersScreen from './ManageTrainersScreen';
import ManageCustomersScreen from './ManageCustomersScreen'; // Import ManageCustomersScreen
import ReportsScreen from './ReportsScreen';
import InvoicesScreen from './InvoicesScreen'; // Import InvoicesScreen
import AnnouncementsScreen from './AnnouncementsScreen';

const { width } = Dimensions.get('window');

interface OwnerDashboardScreenProps {
  navigation: any;
}

const OwnerDashboardScreen = ({ navigation }: OwnerDashboardScreenProps) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // State to manage active tab in bottom navigation
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // New state for confirmation modal

  const ownerStats = {
    totalTrainers: 5,
    totalClients: 150,
    revenueThisMonth: '₹50,000',
    pendingApprovals: 3,
  };

  // Sample data for charts
  const profitData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20000, 25000, 30000, 28000, 35000, 42000],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const sessionsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [120, 150, 180, 200, 170, 220],
      },
    ],
  };

  const revenueData = [
    {
      name: 'Branch A',
      population: 45000,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Branch B',
      population: 38000,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Branch C',
      population: 32000,
      color: '#FFCE56',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Branch D',
      population: 28000,
      color: '#4BC0C0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
    formatYLabel: (value: string | number) => {
      const num = parseFloat(value.toString());
      if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k';
      }
      return num.toString();
    },
  };

  // Dark theme chart configurations for modern look
  const darkChartConfig = {
    backgroundColor: colors.darkGray,
    backgroundGradientFrom: colors.darkGray,
    backgroundGradientTo: colors.black,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => colors.lightGray,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
    formatYLabel: (value: string | number) => {
      const num = parseFloat(value.toString());
      if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k';
      }
      return num.toString();
    },
  };

  const sessionChartConfig = {
    backgroundColor: colors.darkGray,
    backgroundGradientFrom: colors.darkGray,
    backgroundGradientTo: colors.black,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => colors.lightGray,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const revenueChartConfig = {
    backgroundColor: colors.darkGray,
    backgroundGradientFrom: colors.darkGray,
    backgroundGradientTo: colors.black,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
    labelColor: (opacity = 1) => colors.lightGray,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const navigateAndCloseMenu = (screenName: string) => {
    navigation.navigate(screenName);
    setMenuVisible(false);
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

  // Quick Action Handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'addTrainer':
        navigation.navigate('ManageTrainers');
        break;
      case 'sendAnnouncement':
        navigation.navigate('Announcements');
        break;
      case 'generateReport':
        navigation.navigate('Reports');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
  };

  // Function to render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // Render the dashboard overview with modern design
        return (
          <ScrollView style={styles.dashboardContainer} contentContainerStyle={styles.dashboardContent}>
            {/* Welcome Header */}
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeHeader}>
                <Icon name="building" size={60} color={colors.bottleGreen} />
                <View style={styles.welcomeText}>
                  <Text style={styles.welcomeTitle}>Welcome back!</Text>
                  <Text style={styles.welcomeSubtitle}>Starlet Fitness Dashboard</Text>
                </View>
              </View>
              <Text style={styles.welcomeDescription}>Monitor your fitness empire performance and manage your business operations</Text>
            </View>

            {/* Stats Cards Section */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>📊 Performance Overview</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Icon name="users" size={24} color={colors.bottleGreen} />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>{ownerStats.totalTrainers}</Text>
                    <Text style={styles.statLabel}>Active Trainers</Text>
                    <View style={styles.statTrend}>
                      <Icon name="trending-up" size={12} color={colors.bottleGreen} />
                      <Text style={styles.statTrendText}>+12% this month</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Icon name="user-circle-o" size={24} color={colors.bottleGreen} />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>{ownerStats.totalClients}</Text>
                    <Text style={styles.statLabel}>Total Clients</Text>
                    <View style={styles.statTrend}>
                      <Icon name="trending-up" size={12} color={colors.bottleGreen} />
                      <Text style={styles.statTrendText}>+8% this month</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Icon name="money" size={24} color={colors.bottleGreen} />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>{ownerStats.revenueThisMonth}</Text>
                    <Text style={styles.statLabel}>Monthly Revenue</Text>
                    <View style={styles.statTrend}>
                      <Icon name="trending-up" size={12} color={colors.bottleGreen} />
                      <Text style={styles.statTrendText}>+15% this month</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Icon name="hourglass-half" size={24} color={colors.bottleGreen} />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>{ownerStats.pendingApprovals}</Text>
                    <Text style={styles.statLabel}>Pending Approvals</Text>
                    <View style={styles.statTrend}>
                      <Icon name="clock-o" size={12} color={colors.bottleGreen} />
                      <Text style={styles.statTrendText}>Requires attention</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Charts Section */}
            <View style={styles.chartsSection}>
              <Text style={styles.sectionTitle}>📈 Analytics & Insights</Text>

              {/* Profit Trend Chart */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>💰 Profit Trend</Text>
                  <View style={styles.chartBadge}>
                    <Text style={styles.chartBadgeText}>6 Months</Text>
                  </View>
                </View>
                <LineChart
                  data={profitData}
                  width={width - 60}
                  height={200}
                  chartConfig={darkChartConfig}
                  bezier
                  style={styles.darkChart}
                />
              </View>

              {/* Sessions Chart */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>🏋️ Customer Sessions</Text>
                  <View style={styles.chartBadge}>
                    <Text style={styles.chartBadgeText}>Monthly</Text>
                  </View>
                </View>
                <BarChart
                  data={sessionsData}
                  width={width - 60}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={sessionChartConfig}
                  style={styles.darkChart}
                  showValuesOnTopOfBars
                />
              </View>

              {/* Revenue Distribution */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>🏢 Revenue by Branch</Text>
                  <View style={styles.chartBadge}>
                    <Text style={styles.chartBadgeText}>Current Month</Text>
                  </View>
                </View>
                <PieChart
                  data={revenueData}
                  width={width - 60}
                  height={200}
                  chartConfig={revenueChartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={styles.darkChart}
                />
              </View>
            </View>

            {/* Quick Actions Section */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('addTrainer')}>
                  <Icon name="plus" size={20} color={colors.bottleGreen} />
                  <Text style={styles.actionText}>Add Trainer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('sendAnnouncement')}>
                  <Icon name="bullhorn" size={20} color={colors.bottleGreen} />
                  <Text style={styles.actionText}>Send Announcement</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('generateReport')}>
                  <Icon name="file-text-o" size={20} color={colors.bottleGreen} />
                  <Text style={styles.actionText}>Generate Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleQuickAction('settings')}>
                  <Icon name="cog" size={20} color={colors.bottleGreen} />
                  <Text style={styles.actionText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );
      case 'manageBranches':
        return <ManageBranchesScreen navigation={navigation} />; // Render ManageBranchesScreen
      case 'manageTrainers':
        return <ManageTrainersScreen navigation={navigation} />; // Render ManageTrainersScreen
      case 'manageCustomers':
        return <ManageCustomersScreen navigation={navigation} />; // Render ManageCustomersScreen
      case 'reports':
        return <ReportsScreen navigation={navigation} />; // Render ReportsScreen
      case 'invoices':
        return <InvoicesScreen navigation={navigation} />; // Render InvoicesScreen
      case 'announcements':
        return <AnnouncementsScreen navigation={navigation} />; // Render AnnouncementsScreen
      default:
        // Fallback to dashboard if an unknown tab is selected
        return (
          <ScrollView style={AppStyles.profileContainer} contentContainerStyle={AppStyles.profileContentContainer}>
            <View style={AppStyles.profileHeader}>
              <Icon name="building" size={80} color={colors.primary} />
              <Text style={AppStyles.profileName}>Starlet Fitness Admin</Text>
              <Text style={AppStyles.profileAge}>Owner Panel</Text>
            </View>
            <View style={AppStyles.profileDetailsContainer}>
              <View style={AppStyles.detailRow}>
                <Icon name="users" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Total Trainers: <Text style={AppStyles.profileDetailBold}>{ownerStats.totalTrainers}</Text></Text>
              </View>
              <View style={AppStyles.detailRow}>
                <Icon name="user-circle-o" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Total Clients: <Text style={AppStyles.profileDetailBold}>{ownerStats.totalClients}</Text></Text>
              </View>
              <View style={AppStyles.detailRow}>
                <Icon name="money" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Revenue (This Month): <Text style={AppStyles.profileDetailBold}>{ownerStats.revenueThisMonth}</Text></Text>
              </View>
              <View style={AppStyles.detailRow}>
                <Icon name="hourglass-half" size={20} color={colors.lightGray} style={AppStyles.detailIcon} />
                <Text style={AppStyles.profileDetailText}>Pending Approvals: <Text style={AppStyles.profileDetailBold}>{ownerStats.pendingApprovals}</Text></Text>
              </View>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <StatusBar backgroundColor={colors.black} barStyle="light-content" />

      {/* Custom Header */}
      <View style={AppStyles.customHeader}>
        <Image source={require('../images/logo_main.png')} style={AppStyles.headerLogo} />
        <View style={AppStyles.headerIcons}>
          <TouchableOpacity style={AppStyles.headerIcon} onPress={() => setMenuVisible(true)}>
            <Icon name="bars" size={24} color={colors.lightGray} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area - Renders based on activeTab */}
      <View style={AppStyles.mainContent}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={AppStyles.bottomNav}>
        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('dashboard')}
        >
          <Icon name="home" size={24} color={activeTab === 'dashboard' ? colors.red : colors.mediumGray} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'dashboard' && AppStyles.bottomNavTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>



        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('manageTrainers')}
        >
          <Icon name="users" size={24} color={activeTab === 'manageTrainers' ? colors.red : colors.mediumGray} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'manageTrainers' && AppStyles.bottomNavTextActive]}>
            Trainers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('manageCustomers')}
        >
          <Icon name="user-circle-o" size={24} color={activeTab === 'manageCustomers' ? colors.red : colors.mediumGray} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'manageCustomers' && AppStyles.bottomNavTextActive]}>
            Customers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('reports')}
        >
          <Icon name="bar-chart" size={24} color={activeTab === 'reports' ? colors.red : colors.mediumGray} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'reports' && AppStyles.bottomNavTextActive]}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hamburger Menu Modal (remains the same) */}
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
            {/* Add other admin-specific navigation items here if needed */}
            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={() => navigateAndCloseMenu('ManageBranches')} // Example: Link to ManageBranches
            >
              <Icon name="sitemap" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Branches</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={() => navigateAndCloseMenu('Invoices')} // Example: Link to Invoices
            >
              <Icon name="file-text-o" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Invoices</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={AppStyles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Announcements');
              }}
            >
              <Icon name="bullhorn" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Announcements</Text>
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
            <Icon name="times-circle" size={60} color={colors.red} /> {/* Changed to a more appropriate icon */}
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

// Comprehensive styles for modern dashboard design
const styles = StyleSheet.create({
  // Dashboard Container
  dashboardContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  dashboardContent: {
    paddingBottom: 100,
  },

  // Welcome Section
  welcomeSection: {
    alignItems: 'center' as const,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  welcomeHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 15,
  },
  welcomeText: {
    marginLeft: 15,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.bottleGreen,
    fontWeight: '600' as const,
  },
  welcomeDescription: {
    fontSize: 14,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    lineHeight: 20,
    opacity: 0.8,
  },

  // Section Titles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 20,
    textAlign: 'center' as const,
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bottleGreen + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 10,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.mediumGray,
    marginBottom: 6,
    fontWeight: '500' as const,
  },
  statTrend: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  statTrendText: {
    fontSize: 12,
    color: colors.bottleGreen,
    marginLeft: 4,
    fontWeight: '600' as const,
  },

  // Charts Section
  chartsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  chartHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.lightGray,
  },
  chartBadge: {
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chartBadgeText: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: '600' as const,
  },

  // Chart Styles
  darkChart: {
    marginVertical: 8,
    borderRadius: 16,
  },

  // Quick Actions Section
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.darkGray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center' as const,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.lightGray,
    marginTop: 8,
    textAlign: 'center' as const,
  },

  // Legacy chart styles (keeping for backward compatibility)
  chartContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    padding: 5,
  },

  // Additional styles for better centering
  centeredContent: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
});

export default OwnerDashboardScreen;
