import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

// Define the current time for filtering slots
const now = new Date();
const todayString = now.toISOString().split('T')[0];

interface TimeSlot {
  time: string;
  slotsAvailable: number; // 0: Booked, 1: One slot available, 2: Two slots available
}

// Define the interface for calendar markings
interface CalendarMarking {
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
}

// Define the interface for a booking
interface Booking {
  id: string;
  date: string;
  time: string;
  timestamp: number; // Unix timestamp in milliseconds
}

const BookSession = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); // State to store detailed bookings
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false); // For the final "BOOKING CONFIRMED!" modal
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false); // For the "Are you sure?" modal for booking
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState<Booking | null>(null); // State to hold the booking to be cancelled
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState<boolean>(false); // For the "Are you sure?" modal for cancellation
  const [numberOfSlots, setNumberOfSlots] = useState<number>(1); // Default to 1 slot

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots());
      setSelectedSlot(null); // Reset selected slot when date changes
      setBookingConfirmed(false); // Reset final confirmation
      setShowConfirmationModal(false); // Reset intermediate confirmation
      setNumberOfSlots(1); // Reset slot count
    }
  }, [selectedDate]);

  // Effect to reset cancellation states when date changes or a new booking is made
  useEffect(() => {
    setSelectedBookingToCancel(null);
    setShowCancelConfirmModal(false);
  }, [selectedDate, bookings]); // Depend on bookings to reset if a booking is cancelled

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const selectedDateObj = new Date(selectedDate || todayString);

    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour}:${minute === 0 ? '00' : minute}`;
        const slotDateTime = new Date(`${selectedDate}T${time}:00`);

        let slotsAvailable = 0;

        // Check if the slot is in the past relative to 'now'
        if (slotDateTime.getTime() <= now.getTime()) {
          slotsAvailable = 0; // Mark as unavailable if it's in the past
        } else {
          // For future slots, simulate availability
          const random = Math.random();
          if (random < 0.3) { // ~30% chance of 0 slots (booked)
            slotsAvailable = 0;
          } else if (random < 0.7) { // ~40% chance of 1 slot
            slotsAvailable = 1;
          } else { // ~30% chance of 2 slots
            slotsAvailable = 2;
          }
        }
        slots.push({ time, slotsAvailable });
      }
    }
    return slots;
  };

  const handleDateSelect = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.slotsAvailable > 0) { // Only allow selection if slots are available
      setSelectedSlot(slot.time);
    }
  };

  const handleConfirmBookingPress = () => {
    if (selectedDate && selectedSlot) {
      setShowConfirmationModal(true); // Show the "Are you sure?" modal for booking
    }
  };

  const handleFinalBooking = () => {
    if (selectedDate && selectedSlot) {
      const bookingTimestamp = new Date(`${selectedDate}T${selectedSlot}:00`).getTime();
      const newBooking: Booking = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Simple unique ID
        date: selectedDate,
        time: selectedSlot,
        timestamp: bookingTimestamp,
      };
      setBookings(prev => [...prev, newBooking]); // Add the new booking

      setBookingConfirmed(true);
      setShowConfirmationModal(false); // Hide the "Are you sure?" modal

      // Reset states after a delay
      setTimeout(() => {
        setBookingConfirmed(false);
        setSelectedDate(null); // Deselect the date after confirmation
        setSelectedSlot(null);
        setNumberOfSlots(1); // Reset slot count
      }, 3000);
    }
  };

  // Find the currently selected slot's details to check its availability
  const currentSelectedSlotDetails = timeSlots.find(slot => slot.time === selectedSlot);
  const isSlotWithMultipleAvailability = currentSelectedSlotDetails ? currentSelectedSlotDetails.slotsAvailable > 1 : false;

  // Calculate today and the date 6 days from now
  const sixDaysFromNow = new Date();
  sixDaysFromNow.setDate(now.getDate() + 6);
  const sixDaysFromNowString = sixDaysFromNow.toISOString().split('T')[0];

  // Dynamically create markedDates object with explicit typing
  const markedDates: Record<string, CalendarMarking> = bookings.reduce<Record<string, CalendarMarking>>((acc, booking) => {
    // Mark booked dates with a red dot
    if (!acc[booking.date]) {
      acc[booking.date] = { marked: true, dotColor: colors.red };
    } else {
      // If date already marked, ensure dotColor is red if it's a booking
      acc[booking.date].marked = true;
      acc[booking.date].dotColor = colors.red;
    }
    return acc;
  }, {});

  // If a date is selected, add its specific styling
  if (selectedDate) {
    const selectedDateMarking: CalendarMarking = {
      selected: true,
      selectedColor: colors.lightGray,
      dotColor: colors.black, // This will override the red dot if the date is also booked
    };

    // Merge with existing marking if the date is already booked
    if (markedDates[selectedDate]) {
      markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        ...selectedDateMarking,
      };
    } else {
      // Otherwise, just assign the selected date marking
      markedDates[selectedDate] = selectedDateMarking;
    }
  }

  // Function to handle cancellation
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
    setShowCancelConfirmModal(false);
    setSelectedBookingToCancel(null);
    // Optionally, you might want to re-fetch or re-render something here
  };

  // Find the booking to cancel from the state
  const bookingToCancel = bookings.find(b => b.id === selectedBookingToCancel?.id);

  // Check if the selected booking is cancellable
  const isCancellable = bookingToCancel
    ? bookingToCancel.timestamp - now.getTime() >= 4 * 60 * 60 * 1000 // 4 hours in milliseconds
    : false;

  return (
    <View style={AppStyles.sessionContainer}>
      <Text style={AppStyles.sectionTitle}>BOOK YOUR SESSION</Text>

      <ScrollView contentContainerStyle={AppStyles.scrollContent}>
        <View style={AppStyles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            minDate={todayString} // Added minDate
            maxDate={sixDaysFromNowString} // Added maxDate
            theme={{
              calendarBackground: colors.black,
              textSectionTitleColor: colors.lightGray,
              selectedDayBackgroundColor: colors.lightGray,
              selectedDayTextColor: colors.black,
              todayTextColor: '#ff0000', // Highlight today
              dayTextColor: colors.lightGray,
              textDisabledColor: colors.mediumGray,
              dotColor: '#ff0000',
              selectedDotColor: colors.black,
              arrowColor: colors.lightGray,
              monthTextColor: colors.lightGray,
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 18,
            }}
          />
        </View>

        {/* Information section when no date is selected */}
        {!selectedDate && (
          <View style={AppStyles.infoSectionContainer}>
            {/* Welcome Section */}
            <View style={AppStyles.infoCard}>
              <View style={AppStyles.infoHeader}>
                <Icon name="star" size={24} color={colors.lightGray} style={AppStyles.infoIcon} />
                <Text style={AppStyles.infoTitle}>Welcome to Starlet Fitness</Text>
              </View>
              <Text style={AppStyles.infoText}>
                Book your personalized training sessions with our expert trainers. Choose from individual or group sessions tailored to your fitness goals.
              </Text>
            </View>

            {/* Services Section */}
            <View style={AppStyles.servicesContainer}>
              <Text style={AppStyles.servicesTitle}>Our Services</Text>
              <View style={AppStyles.servicesGrid}>
                <View style={AppStyles.serviceCard}>
                  <Icon name="heart" size={30} color={colors.red} />
                  <Text style={AppStyles.serviceTitle}>Personal Training</Text>
                  <Text style={AppStyles.serviceText}>One-on-one sessions with certified trainers</Text>
                </View>
                <View style={AppStyles.serviceCard}>
                  <Icon name="users" size={30} color={colors.red} />
                  <Text style={AppStyles.serviceTitle}>Group Classes</Text>
                  <Text style={AppStyles.serviceText}>High-energy group workouts</Text>
                </View>
                <View style={AppStyles.serviceCard}>
                  <Icon name="trophy" size={30} color={colors.red} />
                  <Text style={AppStyles.serviceTitle}>Nutrition Guidance</Text>
                  <Text style={AppStyles.serviceText}>Personalized diet plans</Text>
                </View>
                <View style={AppStyles.serviceCard}>
                  <Icon name="calendar" size={30} color={colors.red} />
                  <Text style={AppStyles.serviceTitle}>Flexible Scheduling</Text>
                  <Text style={AppStyles.serviceText}>Book sessions that fit your schedule</Text>
                </View>
              </View>
            </View>

            {/* How to Book Section */}
            <View style={AppStyles.infoCard}>
              <View style={AppStyles.infoHeader}>
                <Icon name="question-circle" size={24} color={colors.lightGray} style={AppStyles.infoIcon} />
                <Text style={AppStyles.infoTitle}>How to Book</Text>
              </View>
              <View style={AppStyles.stepsContainer}>
                <View style={AppStyles.step}>
                  <Text style={AppStyles.stepNumber}>1</Text>
                  <Text style={AppStyles.stepText}>Select your preferred date on the calendar</Text>
                </View>
                <View style={AppStyles.step}>
                  <Text style={AppStyles.stepNumber}>2</Text>
                  <Text style={AppStyles.stepText}>Choose an available time slot</Text>
                </View>
                <View style={AppStyles.step}>
                  <Text style={AppStyles.stepNumber}>3</Text>
                  <Text style={AppStyles.stepText}>Confirm your booking</Text>
                </View>
              </View>
            </View>

            {/* Tips Section */}
            <View style={AppStyles.infoCard}>
              <View style={AppStyles.infoHeader}>
                <Icon name="lightbulb-o" size={24} color={colors.lightGray} style={AppStyles.infoIcon} />
                <Text style={AppStyles.infoTitle}>Booking Tips</Text>
              </View>
              <View style={AppStyles.tipsList}>
                <Text style={AppStyles.tipItem}>• Book sessions at least 4 hours in advance</Text>
                <Text style={AppStyles.tipItem}>• Cancellations must be made 4+ hours before the session</Text>
                <Text style={AppStyles.tipItem}>• Green slots indicate availability</Text>
                <Text style={AppStyles.tipItem}>• Red dots show dates with existing bookings</Text>
              </View>
            </View>


          </View>
        )}

        {selectedDate && (
          <View style={AppStyles.timeSlotsContainer}>
            <Text style={AppStyles.timeSlotsTitle}>
              Available slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>

            <View style={AppStyles.timeSlotsGrid}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    AppStyles.timeSlot,
                    slot.slotsAvailable === 0 && AppStyles.timeSlotBooked, // Style for booked slots
                    slot.slotsAvailable === 1 && AppStyles.timeSlotOneAvailable, // Style for 1 slot available
                    slot.slotsAvailable === 2 && AppStyles.timeSlotTwoAvailable, // Style for 2 slots available
                    selectedSlot === slot.time && AppStyles.timeSlotSelected // Style for selected slot
                  ]}
                  onPress={() => handleSlotSelect(slot)}
                  disabled={slot.slotsAvailable === 0} // Disable if no slots available
                >
                  <Text style={[
                    AppStyles.timeSlotText,
                    slot.slotsAvailable === 0 && AppStyles.timeSlotTextBooked, // Text style for booked slots
                    slot.slotsAvailable === 1 && AppStyles.timeSlotTextOneAvailable, // Text style for 1 slot available
                    slot.slotsAvailable === 2 && AppStyles.timeSlotTextTwoAvailable, // Text style for 2 slots available
                    selectedSlot === slot.time && AppStyles.timeSlotTextSelected // Text style for selected slot
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedSlot && (
              <TouchableOpacity
                style={AppStyles.confirmButton}
                onPress={handleConfirmBookingPress} // Show the "Are you sure?" modal
              >
                <Text style={AppStyles.confirmButtonText}>CONFIRM BOOKING</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Display existing bookings */}
        {bookings.length > 0 && (
          <View style={AppStyles.myBookingsContainer}>
            <Text style={AppStyles.sectionTitle}>MY BOOKINGS</Text>
            {bookings.map((booking) => {
              const bookingDateTime = new Date(booking.timestamp);
              const isCancellable = bookingDateTime.getTime() - now.getTime() >= 4 * 60 * 60 * 1000; // 4 hours in milliseconds

              return (
                <View key={booking.id} style={AppStyles.bookingItem}>
                  <View>
                    <Text style={AppStyles.bookingText}>
                      {booking.date} at {booking.time}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      AppStyles.bookingCancelButton,
                      !isCancellable && AppStyles.bookingCancelButtonDisabled // Style for disabled button
                    ]}
                    onPress={() => {
                      if (isCancellable) {
                        setSelectedBookingToCancel(booking);
                        setShowCancelConfirmModal(true);
                      }
                    }}
                    disabled={!isCancellable}
                  >
                    <Text style={AppStyles.bookingCancelButtonText}>
                      {isCancellable ? 'Cancel' : 'Cannot Cancel'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal for "Are you sure?" to BOOK */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={AppStyles.modalContainer}>
          <View style={[AppStyles.modalContent, { padding: 20 }]}>
            <Text style={[AppStyles.modalTitle, { marginBottom: 10 }]}>Are you sure you want to book this session?</Text>
            <Text style={[AppStyles.modalText, { marginBottom: 20 }]}>
              You cannot cancel if the session is in less than 4 hours.
            </Text>

            <Text style={[AppStyles.modalText, { marginBottom: 20, fontWeight: 'bold' }]}>
              Booking: {selectedSlot} on {selectedDate && new Date(selectedDate).toLocaleDateString()} for {numberOfSlots} slot(s)
            </Text>

            {isSlotWithMultipleAvailability && (
              <View style={AppStyles.slotSelectionContainer}>
                <Text style={AppStyles.slotSelectionLabel}>Select number of slots:</Text>
                <View style={AppStyles.slotSelectionButtons}>
                  <TouchableOpacity
                    style={[
                      AppStyles.slotSelectionButton,
                      numberOfSlots === 1 && AppStyles.slotSelectionButtonSelected
                    ]}
                    onPress={() => setNumberOfSlots(1)}
                  >
                    <Text style={[
                      AppStyles.slotSelectionButtonText,
                      numberOfSlots === 1 && AppStyles.slotSelectionButtonTextSelected
                    ]}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      AppStyles.slotSelectionButton,
                      numberOfSlots === 2 && AppStyles.slotSelectionButtonSelected
                    ]}
                    onPress={() => setNumberOfSlots(2)}
                  >
                    <Text style={[
                      AppStyles.slotSelectionButtonText,
                      numberOfSlots === 2 && AppStyles.slotSelectionButtonTextSelected
                    ]}>2</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 }}>
              <TouchableOpacity
                style={[AppStyles.confirmButton, AppStyles.modalButton]}
                onPress={handleFinalBooking}
              >
                <Text style={AppStyles.confirmButtonText}>PROCEED</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[AppStyles.cancelButton, AppStyles.modalButton]}
                onPress={() => {
                  setShowConfirmationModal(false);
                  setSelectedSlot(null); // Deselect slot if cancelled
                  setNumberOfSlots(1); // Reset slot count
                }}
              >
                <Text style={AppStyles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Final Booking Confirmation Modal */}
      <Modal
        visible={bookingConfirmed}
        transparent={true}
        animationType="fade"
      >
        <View style={AppStyles.modalContainer}>
          <View style={AppStyles.modalContent}>
            <Text style={{ fontSize: 60, color: '#ff0000' }}>✓</Text>
            <Text style={AppStyles.modalTitle}>BOOKING CONFIRMED!</Text>
            <Text style={AppStyles.modalText}>
              Your session on {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'N/A'} at {selectedSlot || 'N/A'} for {numberOfSlots} slot(s) has been booked.
            </Text>
            <TouchableOpacity
              style={AppStyles.confirmButton}
              onPress={() => {
                setBookingConfirmed(false);
                setSelectedSlot(null);
                setNumberOfSlots(1);
              }}
            >
              <Text style={AppStyles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancellation Confirmation Modal */}
      <Modal
        visible={showCancelConfirmModal}
        transparent={true}
        animationType="fade"
      >
        <View style={AppStyles.modalContainer}>
          <View style={[AppStyles.modalContent, { padding: 20 }]}>
            <Text style={[AppStyles.modalTitle, { marginBottom: 10 }]}>Confirm Cancellation</Text>
            <Text style={[AppStyles.modalText, { marginBottom: 20 }]}>
              Are you sure you want to cancel your session on {bookingToCancel?.date} at {bookingToCancel?.time}?
            </Text>
            {!isCancellable && (
              <Text style={[AppStyles.modalText, { color: colors.red, marginBottom: 20 }]}>
                This booking cannot be cancelled as it is less than 4 hours away.
              </Text>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 }}>
              <TouchableOpacity
                style={[AppStyles.confirmButton, AppStyles.modalButton]}
                onPress={() => {
                  if (bookingToCancel && isCancellable) {
                    handleCancelBooking(bookingToCancel.id);
                  }
                }}
                disabled={!isCancellable} // Disable if not cancellable
              >
                <Text style={AppStyles.confirmButtonText}>
                  {isCancellable ? 'Yes, Cancel' : 'Cannot Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[AppStyles.cancelButton, AppStyles.modalButton]}
                onPress={() => {
                  setShowCancelConfirmModal(false);
                  setSelectedBookingToCancel(null);
                }}
              >
                <Text style={AppStyles.cancelButtonText}>No, Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookSession;
