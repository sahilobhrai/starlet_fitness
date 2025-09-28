import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

interface UpcomingBookingsScreenProps {
  navigation: any;
}

const UpcomingBookingsScreen = ({ navigation }: UpcomingBookingsScreenProps) => {
  
  const upcomingBookings = [
    { id: '5', customerName: 'Eve Adams', sessionDate: '2025-10-03', sessionTime: '11:00 AM', sessionType: 'Training', phoneNumber: 'tel:+15551234567' },
    { id: '6', customerName: 'Frank White', sessionDate: '2025-10-03', sessionTime: '03:00 PM', sessionType: 'Training', phoneNumber: 'tel:+15551234568' },
    { id: '7', customerName: 'Grace Lee', sessionDate: '2025-10-04', sessionTime: '10:30 AM', sessionType: 'Training', phoneNumber: 'tel:+15551234569' },
  ];

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(phoneNumber).catch(err => console.error('Failed to open dialer:', err));
  };

  

  const renderBookingItem = ({ item }: { item: any }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingInfo}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.bookingDetails}>{item.sessionType} - {item.sessionDate} at {item.sessionTime}</Text>
      </View>
      <TouchableOpacity style={styles.contactButton} onPress={() => handleCall(item.phoneNumber)}>
        <Icon name="phone" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={AppStyles.profileContainer}>
    
      <Text style={[AppStyles.sectionTitle, { marginTop: 20 }]}>UPCOMING BOOKINGS & CUSTOMERS</Text>
      <FlatList
        data={upcomingBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Disable scrolling for inner FlatList
      />
    </ScrollView>
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
