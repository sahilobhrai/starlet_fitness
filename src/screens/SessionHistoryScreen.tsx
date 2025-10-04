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

  const renderSessionItem = ({ item }: { item: any }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.trainerInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.trainer.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.trainerDetails}>
            <Text style={styles.trainerName}>{item.trainer}</Text>
            <View style={styles.sessionTypeBadge}>
              <Text style={styles.sessionTypeText}>{item.type}</Text>
            </View>
          </View>
        </View>
        <View style={styles.sessionIdContainer}>
          <Text style={styles.sessionIdText}>ID: {item.id}</Text>
        </View>
      </View>

      <View style={styles.sessionInfo}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={16} color={colors.bottleGreen} />
            <Text style={styles.dateTimeText}>{item.date}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Icon name="clock-o" size={16} color={colors.bottleGreen} />
            <Text style={styles.dateTimeText}>{item.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sessionStatus}>
        <View style={styles.statusBadge}>
          <Icon name="check-circle" size={14} color={colors.bottleGreen} />
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Icon name="history" size={60} color={colors.bottleGreen} />
      </View>
      <Text style={styles.emptyStateTitle}>No Session History</Text>
      <Text style={styles.emptyStateSubtitle}>Your completed sessions will appear here</Text>
      <Text style={styles.emptyStateDescription}>
        Once you complete training sessions, they will be recorded here for your reference.
      </Text>
      <View style={styles.emptyStateTip}>
        <Text style={styles.emptyStateTipText}>
          💡 Tip: Complete your upcoming sessions to build your history
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={AppStyles.mainContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Session History</Text>
          <Text style={styles.pageSubtitle}>View your completed training sessions and performance</Text>
        </View>

        {/* Sessions List Section */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Completed Sessions ({allSessions.length})</Text>
          </View>

          {Object.keys(groupedSessions).length > 0 ? (
            Object.keys(groupedSessions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((month) => (
              <View key={month} style={styles.monthContainer}>
                <Text style={styles.monthTitle}>{month} ({groupedSessions[month].length} sessions)</Text>
                {groupedSessions[month].map((session) => (
                  <View key={session.id}>
                    {renderSessionItem({ item: session })}
                  </View>
                ))}
              </View>
            ))
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  // Header Section
  headerSection: {
    alignItems: 'center' as const,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  pageSubtitle: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    lineHeight: 22,
  },

  // List Section
  listSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.lightGray,
    textAlign: 'center' as const,
  },

  // Month Container
  monthContainer: {
    marginBottom: 25,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.bottleGreen,
    marginBottom: 15,
    paddingHorizontal: 5,
  },

  // Session Card
  sessionCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
  },

  // Session Header
  sessionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 15,
  },
  trainerInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.bottleGreen,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.lightGray,
  },
  trainerDetails: {
    flex: 1,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 5,
  },
  sessionTypeBadge: {
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
  },
  sessionTypeText: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: 'bold' as const,
  },
  sessionIdContainer: {
    backgroundColor: colors.lightGray + '10',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sessionIdText: {
    fontSize: 12,
    color: colors.lightGray,
    fontWeight: 'bold' as const,
  },

  // Session Info Section
  sessionInfo: {
    marginBottom: 15,
  },
  dateTimeContainer: {
    backgroundColor: colors.black + '40',
    borderRadius: 12,
    padding: 15,
  },
  dateContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.lightGray,
    marginLeft: 8,
    fontWeight: '600' as const,
  },

  // Session Status
  sessionStatus: {
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray + '30',
    paddingTop: 15,
  },
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start' as const,
  },
  statusText: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: '700' as const,
    marginLeft: 6,
  },

  // Empty State
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.bottleGreen + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.mediumGray,
    marginBottom: 10,
    textAlign: 'center' as const,
  },
  emptyStateSubtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.lightGray,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyStateTip: {
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateTipText: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
});

export default SessionHistoryScreen;
