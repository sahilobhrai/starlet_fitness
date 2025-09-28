import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

interface SessionHistoryScreenProps {
  navigation: any;
}

const SessionHistoryScreen = ({ navigation }: SessionHistoryScreenProps) => {
  const allSessions = [
    { id: '1', date: '2025-09-15', time: '10:00 AM', type: 'Strength Training', trainer: 'John Doe' },
    { id: '2', date: '2025-09-10', time: '03:00 PM', type: 'Cardio', trainer: 'Jane Smith' },
    { id: '3', date: '2025-09-05', time: '09:00 AM', type: 'Yoga', trainer: 'Alice Brown' },
    { id: '4', date: '2025-08-20', time: '11:00 AM', type: 'Pilates', trainer: 'John Doe' },
    { id: '5', date: '2025-08-10', time: '01:00 PM', type: 'Strength Training', trainer: 'Jane Smith' },
    { id: '6', date: '2025-07-25', time: '04:00 PM', type: 'Cardio', trainer: 'Alice Brown' },
  ];

  // Group sessions by month
  const groupedSessions = allSessions.reduce((acc: { [key: string]: any[] }, session) => {
    const month = new Date(session.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(session);
    return acc;
  }, {});

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={AppStyles.customHeader}>
        <Text style={AppStyles.sectionTitle}>Session History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.keys(groupedSessions).length > 0 ? (
          Object.keys(groupedSessions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((month) => (
            <View key={month} style={styles.monthContainer}>
              <Text style={[AppStyles.sectionTitle, styles.monthTitleOverride]}>{month} ({groupedSessions[month].length} sessions)</Text>
              {groupedSessions[month].map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionClientName}>{session.trainer}</Text>
                    <Text style={styles.sessionDetailsText}>{session.type} - {session.date} at {session.time}</Text>
                  </View>
                  
                </View>
              ))}
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
    padding: 10, // Adjusted padding to match UpcomingBookingsScreen's listContent
    paddingBottom: 20,
  },
  monthContainer: {
    marginBottom: 20,
  },
  monthTitleOverride: {
    fontSize: 20, // Keep font size for month title
    marginBottom: 10,
    paddingHorizontal: 10, // Add horizontal padding for consistency
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionClientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sessionDetailsText: {
    fontSize: 14,
    color: colors.mediumGray,
    marginTop: 5,
  },
  viewDetailsButton: {
    backgroundColor: colors.primary, // Using primary color for consistency
    padding: 10,
    borderRadius: 5,
  },
  noSessionsText: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default SessionHistoryScreen;
