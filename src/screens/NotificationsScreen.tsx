import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';

const NotificationsScreen = ({ navigation }: { navigation: any }) => {
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [mealPlanUpdates, setMealPlanUpdates] = useState(true);
  const [communityActivity, setCommunityActivity] = useState(false);
  const [promotionalOffers, setPromotionalOffers] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.lightGray} />
      </TouchableOpacity>
      <Text style={styles.title}>Notification Preferences</Text>
      <ScrollView style={styles.settingsList}>
        {/* Workout Reminders */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Workout Reminders</Text>
          <Switch
            trackColor={{ false: colors.darkGray, true: '#ff0000' }}
            thumbColor={workoutReminders ? colors.lightGray : colors.mediumGray}
            onValueChange={() => setWorkoutReminders(previousState => !previousState)}
            value={workoutReminders}
          />
        </View>

        {/* Meal Plan Updates */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Meal Plan Updates</Text>
          <Switch
            trackColor={{ false: colors.darkGray, true: '#ff0000' }}
            thumbColor={mealPlanUpdates ? colors.lightGray : colors.mediumGray}
            onValueChange={() => setMealPlanUpdates(previousState => !previousState)}
            value={mealPlanUpdates}
          />
        </View>

        {/* Community Activity */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Community Activity</Text>
          <Switch
            trackColor={{ false: colors.darkGray, true: '#ff0000' }}
            thumbColor={communityActivity ? colors.lightGray : colors.mediumGray}
            onValueChange={() => setCommunityActivity(previousState => !previousState)}
            value={communityActivity}
          />
        </View>

        {/* Promotional Offers */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Promotional Offers</Text>
          <Switch
            trackColor={{ false: colors.darkGray, true: '#ff0000' }}
            thumbColor={promotionalOffers ? colors.lightGray : colors.mediumGray}
            onValueChange={() => setPromotionalOffers(previousState => !previousState)}
            value={promotionalOffers}
          />
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
});

export default NotificationsScreen;
