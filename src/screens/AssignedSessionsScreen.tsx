import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

interface AssignedSessionsScreenProps {
  navigation: any;
}

const AssignedSessionsScreen = ({ navigation }: AssignedSessionsScreenProps) => {
  const assignedSessions = [
    { id: '1', clientName: 'Alice Johnson', date: '2025-10-01', time: '10:00 AM', type: 'Personal Training' },
    { id: '2', clientName: 'Bob Williams', date: '2025-10-01', time: '02:00 PM', type: 'Group Class' },
    { id: '3', clientName: 'Charlie Brown', date: '2025-10-02', time: '09:00 AM', type: 'Nutrition Coaching' },
    { id: '4', clientName: 'Diana Prince', date: '2025-10-02', time: '04:00 PM', type: 'Personal Training' },
  ];

  const renderSessionItem = ({ item }: { item: any }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionInfo}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={styles.sessionDetails}>{item.type} - {item.date} at {item.time}</Text>
      </View>
      <TouchableOpacity style={styles.viewDetailsButton}>
        <Icon name="chevron-right" size={15} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={AppStyles.profileContainer}>
      <Text style={AppStyles.sectionTitle}>ASSIGNED SESSIONS</Text>
      <FlatList
        data={assignedSessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
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
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sessionDetails: {
    fontSize: 14,
    color: colors.mediumGray,
    marginTop: 5,
  },
  viewDetailsButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
});

export default AssignedSessionsScreen;
