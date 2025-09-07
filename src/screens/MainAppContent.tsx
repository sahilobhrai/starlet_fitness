import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

// Import the individual screen components
import BookSession from './BookSession';
import ChatbotAssistant from './ChatbotAssistant';
import NutritionScreen from './NutritionScreen';
import CommunityScreen from './CommunityScreen';

const { width } = Dimensions.get('window');

function MainAppContent({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('book');
  const [isMenuVisible, setMenuVisible] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'book':
        return <BookSession />;
      case 'chatbot':
        return <ChatbotAssistant navigation={navigation} setActiveTab={setActiveTab} />;
      case 'nutrition':
        return <NutritionScreen />;
      case 'community':
        return <CommunityScreen />;
      default:
        return <BookSession />;
    }
  };

  const navigateAndCloseMenu = (screenName: string) => {
    navigation.navigate(screenName);
    setMenuVisible(false);
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
          onPress={() => setActiveTab('book')}
        >
          <Icon name="home" size={24} color={activeTab === 'book' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'book' && AppStyles.bottomNavTextActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('chatbot')}
        >
          <Icon name="comments" size={24} color={activeTab === 'chatbot' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'chatbot' && AppStyles.bottomNavTextActive]}>
            Assistant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={AppStyles.bottomNavButton}
          onPress={() => setActiveTab('community')}
        >
          <Icon name="group" size={24} color={activeTab === 'community' ? '#ff0000' : '#888'} />
          <Text style={[AppStyles.bottomNavText, activeTab === 'community' && AppStyles.bottomNavTextActive]}>
            Community
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
              onPress={() => navigateAndCloseMenu('Notifications')}
            >
              <Icon name="bell" size={20} color={colors.lightGray} style={AppStyles.menuIcon} />
              <Text style={AppStyles.menuItemText}>Notifications</Text>
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
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

export default MainAppContent;
