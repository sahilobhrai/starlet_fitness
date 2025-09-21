import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

interface UpcomingBookingsScreenProps {
  navigation: any;
}

const UpcomingBookingsScreen = ({ navigation }: UpcomingBookingsScreenProps) => {
  const upcomingBookings = [
    { id: '1', customerName: 'Eve Adams', sessionDate: '2025-10-03', sessionTime: '11:00 AM', sessionType: 'Yoga Class' },
    { id: '2', customerName: 'Frank White', sessionDate: '2025-10-03', sessionTime: '03:00 PM', sessionType: 'Personal Training' },
    { id: '3', customerName: 'Grace Lee', sessionDate: '2025-10-04', sessionTime: '10:30 AM', sessionType: 'Pilates' },
  ];

  const renderBookingItem = ({ item }: { item: any }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingInfo}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.bookingDetails}>{item.sessionType} - {item.sessionDate} at {item.sessionTime}</Text>
      </View>
      <TouchableOpacity style={styles.contactButton}>
        <Icon name="phone" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={AppStyles.profileContainer}>
      <Text style={AppStyles.sectionTitle}>UPCOMING BOOKINGS & CUSTOMERS</Text>
      <FlatList
        data={upcomingBookings}
        renderItem={renderBookingItem}
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
  bookingCard: {
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
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  bookingDetails: {
    fontSize: 14,
    color: colors.mediumGray,
    marginTop: 5,
  },
  contactButton: {
    backgroundColor: colors.lightGreen,
    padding: 10,
    borderRadius: 5,
  },
});

export default UpcomingBookingsScreen;
