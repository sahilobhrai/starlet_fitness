import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

interface SessionHistoryScreenProps {
  navigation: any;
}

const SessionHistoryScreen = ({ navigation }: SessionHistoryScreenProps) => {
  const sessions = [
    { id: '1', date: '2025-09-15', time: '10:00 AM', type: 'Strength Training', trainer: 'John Doe' },
    { id: '2', date: '2025-09-10', time: '03:00 PM', type: 'Cardio', trainer: 'Jane Smith' },
    { id: '3', date: '2025-09-05', time: '09:00 AM', type: 'Yoga', trainer: 'Alice Brown' },
  ];

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={AppStyles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={AppStyles.headerIcon}>
          <Icon name="arrow-left" size={24} color={colors.lightGray} />
        </TouchableOpacity>
        <Text style={AppStyles.sectionTitle}>Session History</Text>
        <View style={AppStyles.headerIcon} /> {/* Placeholder for alignment */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <Text style={styles.sessionDate}>{session.date} at {session.time}</Text>
              <Text style={styles.sessionDetails}>Type: {session.type}</Text>
              <Text style={styles.sessionDetails}>Trainer: {session.trainer}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSessionsText}>No sessions found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  sessionCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  sessionDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginBottom: 5,
  },
  sessionDetails: {
    fontSize: 16,
    color: colors.mediumGray,
    marginBottom: 3,
  },
  noSessionsText: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default SessionHistoryScreen;
