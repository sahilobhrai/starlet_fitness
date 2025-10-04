import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Linking, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

interface UpcomingBookingsScreenProps {
  navigation: any;
}

interface Booking {
  id: string;
  customerName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  phoneNumber: string;
}

interface Trainer {
  id: string;
  name: string;
  isPresent: boolean;
}

const UpcomingBookingsScreen = ({ navigation: _navigation }: UpcomingBookingsScreenProps) => {

  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([
    { id: '5', customerName: 'Eve Adams', sessionDate: '2025-10-03', sessionTime: '11:00 AM', sessionType: 'Training', phoneNumber: 'tel:+15551234567' },
    { id: '6', customerName: 'Frank White', sessionDate: '2025-10-03', sessionTime: '03:00 PM', sessionType: 'Training', phoneNumber: 'tel:+15551234568' },
    { id: '7', customerName: 'Grace Lee', sessionDate: '2025-10-04', sessionTime: '10:30 AM', sessionType: 'Training', phoneNumber: 'tel:+15551234569' },
  ]);

  // Modal and trainer selection state
  const [isEndSessionModalVisible, setIsEndSessionModalVisible] = useState(false);
  const [selectedBookingForEnd, setSelectedBookingForEnd] = useState<Booking | null>(null);
  const [selectedTrainers, setSelectedTrainers] = useState<string[]>([]);

  // Available trainers list
  const availableTrainers: Trainer[] = [
    { id: '1', name: 'John Smith (You)', isPresent: true },
    { id: '2', name: 'Sarah Johnson', isPresent: false },
    { id: '3', name: 'Mike Wilson', isPresent: false },
    { id: '4', name: 'Emma Davis', isPresent: false },
    { id: '5', name: 'Alex Brown', isPresent: false },
  ];

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(phoneNumber).catch(err => {
      console.error('Failed to open dialer:', err);
      Alert.alert('Error', 'Unable to make phone call. Please check your device settings.');
    });
  };

  const handleEndSessionPress = (booking: Booking) => {
    setSelectedBookingForEnd(booking);
    // Pre-select the current trainer (John Smith)
    setSelectedTrainers(['1']);
    setIsEndSessionModalVisible(true);
  };

  const handleTrainerSelection = (trainerId: string) => {
    setSelectedTrainers(prev => {
      if (prev.includes(trainerId)) {
        // Don't allow unselecting the current trainer
        if (trainerId === '1') return prev;
        return prev.filter(id => id !== trainerId);
      } else {
        // Limit selection to maximum 3 trainers (current + 2 more)
        if (prev.length >= 3) {
          Alert.alert('Maximum Trainers', 'You can select a maximum of 3 trainers for this session.');
          return prev;
        }
        return [...prev, trainerId];
      }
    });
  };

  const handleFinishSession = () => {
    if (selectedTrainers.length === 0) {
      Alert.alert('No Trainers Selected', 'Please select at least one trainer to end the session.');
      return;
    }

    const selectedTrainerNames = availableTrainers
      .filter(trainer => selectedTrainers.includes(trainer.id))
      .map(trainer => trainer.name.replace(' (You)', ''));

    // Remove the booking from the list
    setUpcomingBookings(prevBookings => prevBookings.filter(booking => booking.id !== selectedBookingForEnd?.id));

    // Close modal and reset state
    setIsEndSessionModalVisible(false);
    setSelectedBookingForEnd(null);
    setSelectedTrainers([]);

    Alert.alert(
      'Session Ended Successfully!',
      `Rewards have been assigned to: ${selectedTrainerNames.join(', ')}`
    );
  };

  const handleCancelEndSession = () => {
    setIsEndSessionModalVisible(false);
    setSelectedBookingForEnd(null);
    setSelectedTrainers([]);
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.customerName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <View style={styles.sessionTypeBadge}>
              <Text style={styles.sessionTypeText}>{item.sessionType}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdText}>ID: {item.id}</Text>
        </View>
      </View>

      <View style={styles.bookingInfo}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={16} color={colors.bottleGreen} />
            <Text style={styles.dateTimeText}>{item.sessionDate}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Icon name="clock-o" size={16} color={colors.bottleGreen} />
            <Text style={styles.dateTimeText}>{item.sessionTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(item.phoneNumber)}
        >
          <Icon name="phone" size={16} color={colors.lightGray} />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.endButton}
          onPress={() => handleEndSessionPress(item)}
        >
          <Icon name="check-circle" size={16} color={colors.lightGray} />
          <Text style={styles.endButtonText}>End Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Icon name="calendar" size={60} color={colors.bottleGreen} />
      </View>
      <Text style={styles.emptyStateTitle}>No Upcoming Bookings</Text>
      <Text style={styles.emptyStateSubtitle}>All your sessions are completed!</Text>
      <Text style={styles.emptyStateDescription}>
        New bookings will appear here when customers schedule sessions with you.
      </Text>
      <View style={styles.emptyStateTip}>
        <Text style={styles.emptyStateTipText}>
          💡 Tip: Keep an eye on your notifications for new booking requests
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={AppStyles.mainContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Upcoming Bookings</Text>
          <Text style={styles.pageSubtitle}>Manage your scheduled sessions and customer interactions</Text>
        </View>

        {/* Bookings List Section */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Scheduled Sessions ({upcomingBookings.length})</Text>
          </View>

          {upcomingBookings.length > 0 ? (
            <FlatList
              data={upcomingBookings}
              renderItem={renderBookingItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>

      {/* End Session Modal */}
      <Modal
        visible={isEndSessionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEndSession}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>End Session</Text>
            <Text style={styles.modalSubtitle}>
              Select trainers who were present for reward distribution
            </Text>

            {selectedBookingForEnd && (
              <View style={styles.bookingSummary}>
                <Text style={styles.bookingSummaryTitle}>Session Details:</Text>
                <Text style={styles.bookingSummaryText}>
                  {selectedBookingForEnd.customerName} - {selectedBookingForEnd.sessionDate} at {selectedBookingForEnd.sessionTime}
                </Text>
              </View>
            )}

            <ScrollView style={styles.trainersList} showsVerticalScrollIndicator={true}>
              <Text style={styles.trainersListTitle}>Available Trainers:</Text>
              {availableTrainers.map((trainer) => (
                <TouchableOpacity
                  key={trainer.id}
                  style={[
                    styles.trainerItem,
                    selectedTrainers.includes(trainer.id) && styles.trainerItemSelected,
                    trainer.id === '1' && styles.trainerItemCurrent // Special styling for current trainer
                  ]}
                  onPress={() => handleTrainerSelection(trainer.id)}
                >
                  <View style={styles.trainerCheckbox}>
                    {selectedTrainers.includes(trainer.id) ? (
                      <Icon name="check-circle" size={20} color={colors.bottleGreen} />
                    ) : (
                      <Icon name="circle-o" size={20} color={colors.mediumGray} />
                    )}
                  </View>
                  <View style={styles.trainerInfo}>
                    <Text style={[
                      styles.trainerName,
                      selectedTrainers.includes(trainer.id) && styles.trainerNameSelected,
                      trainer.id === '1' && styles.trainerNameCurrent
                    ]}>
                      {trainer.name}
                    </Text>
                    {trainer.id === '1' && (
                      <Text style={styles.trainerCurrentBadge}>Current Trainer</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleCancelEndSession}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalFinishButton}
                onPress={handleFinishSession}
              >
                <Text style={styles.modalFinishButtonText}>
                  Finish Session ({selectedTrainers.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // Booking Card
  bookingCard: {
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

  // Booking Header
  bookingHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 15,
  },
  customerInfo: {
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
  customerDetails: {
    flex: 1,
  },
  customerName: {
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
  bookingIdContainer: {
    backgroundColor: colors.lightGray + '10',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bookingIdText: {
    fontSize: 12,
    color: colors.lightGray,
    fontWeight: 'bold' as const,
  },

  // Booking Info Section
  bookingInfo: {
    marginBottom: 20,
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

  // Button Container
  buttonContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray + '30',
    paddingTop: 15,
  },
  callButton: {
    backgroundColor: colors.bottleGreen,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flex: 1,
    marginRight: 10,
  },
  callButtonText: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: '700' as const,
    marginLeft: 8,
  },
  endButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flex: 1,
    marginLeft: 10,
  },
  endButtonText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700' as const,
    marginLeft: 8,
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalContent: {
    backgroundColor: colors.darkGray,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.bottleGreen + '40',
    justifyContent: 'space-between' as const,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.lightGray,
    textAlign: 'center' as const,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    marginBottom: 20,
    lineHeight: 22,
  },

  // Booking Summary in Modal
  bookingSummary: {
    backgroundColor: colors.black + '40',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.bottleGreen + '30',
  },
  bookingSummaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.bottleGreen,
    marginBottom: 8,
  },
  bookingSummaryText: {
    fontSize: 14,
    color: colors.lightGray,
    lineHeight: 20,
  },

  // Trainers List in Modal
  trainersList: {
    marginBottom: 25,
    maxHeight: 200,
  },
  trainersListTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 15,
  },
  trainerItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.black + '40',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
  },
  trainerItemSelected: {
    backgroundColor: colors.bottleGreen + '20',
    borderColor: colors.bottleGreen,
  },
  trainerItemCurrent: {
    backgroundColor: colors.bottleGreen + '15',
    borderColor: colors.bottleGreen + '60',
  },
  trainerCheckbox: {
    marginRight: 15,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.lightGray,
    marginBottom: 2,
  },
  trainerNameSelected: {
    color: colors.bottleGreen,
  },
  trainerNameCurrent: {
    color: colors.bottleGreen,
    fontWeight: '700' as const,
  },
  trainerCurrentBadge: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: 'bold' as const,
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start' as const,
  },

  // Modal Buttons
  modalButtonContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: 15,
  },
  modalCancelButton: {
    backgroundColor: colors.mediumGray,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center' as const,
  },
  modalCancelButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  modalFinishButton: {
    backgroundColor: colors.bottleGreen,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center' as const,
  },
  modalFinishButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});

export default UpcomingBookingsScreen;
