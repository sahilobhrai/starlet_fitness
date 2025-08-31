import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [dataSyncEnabled, setDataSyncEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.lightGray} />
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>
      <ScrollView style={styles.settingsList}>
        {/* Notifications Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Enable Notifications</Text>
          <Switch
            trackColor={{ false: colors.darkGray, true: '#ff0000' }}
            thumbColor={notificationsEnabled ? colors.lightGray : colors.mediumGray}
            onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
            value={notificationsEnabled}
          />
        </View>

        {/* Dark Mode Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            trackColor={{ false: colors.darkGray, true: '#ff0000' }}
            thumbColor={darkModeEnabled ? colors.lightGray : colors.mediumGray}
            onValueChange={() => setDarkModeEnabled(previousState => !previousState)}
            value={darkModeEnabled}
          />
        </View>

        {/* Data Sync Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Sync Data Automatically</Text>
          <Switch
            trackColor={{ false: colors.darkGray, true: '#ff0000' }}
            thumbColor={dataSyncEnabled ? colors.lightGray : colors.mediumGray}
            onValueChange={() => setDataSyncEnabled(previousState => !previousState)}
            value={dataSyncEnabled}
          />
        </View>

        {/* Account Settings */}
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Account Information</Text>
          <Icon name="chevron-right" size={18} color={colors.mediumGray} />
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy Policy</Text>
          <Icon name="chevron-right" size={18} color={colors.mediumGray} />
        </TouchableOpacity>

        {/* Terms of Service */}
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Terms of Service</Text>
          <Icon name="chevron-right" size={18} color={colors.mediumGray} />
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>App Version: 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.lightGray,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  settingText: {
    fontSize: 18,
    color: colors.lightGray,
  },
  versionInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: colors.mediumGray,
  },
});

export default SettingsScreen;
