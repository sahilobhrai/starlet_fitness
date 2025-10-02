import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Modal, Image } from 'react-native'; // Removed BackHandler
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

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

  // Function to render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // Render the dashboard overview with stats
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
            {/* Removed old cards */}
          </ScrollView>
        );
      case 'manageBranches':
        return <ManageBranchesScreen />; // Render ManageBranchesScreen
      case 'manageTrainers':
        return <ManageTrainersScreen />; // Render ManageTrainersScreen
      case 'manageCustomers':
        return <ManageCustomersScreen />; // Render ManageCustomersScreen
      case 'reports':
        return <ReportsScreen />; // Render ReportsScreen
      case 'invoices':
        return <InvoicesScreen />; // Render InvoicesScreen
      case 'announcements':
        return <AnnouncementsScreen />; // Render AnnouncementsScreen
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

// Styles specific to OwnerDashboardScreen if any, otherwise use AppStyles
const styles = StyleSheet.create({
  // Removed old card styles as they are no longer used
});

export default OwnerDashboardScreen;
