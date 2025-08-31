import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

const { width } = Dimensions.get('window');

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookSession = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots());
      setSelectedSlot(null);
      setBookingConfirmed(false);
    }
  }, [selectedDate]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour}:${minute === 0 ? '00' : minute}`;
        slots.push({ time, available: Math.random() > 0.3 }); // Simulate availability
      }
    }
    return slots;
  };

  const handleDateSelect = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot.time);
    }
  };

  const confirmBooking = () => {
    if (selectedDate && selectedSlot) {
      setBookingConfirmed(true);
      setTimeout(() => {
        setSelectedDate(null);
        setSelectedSlot(null);
        setBookingConfirmed(false);
      }, 2000);
    }
  };

  const markedDates = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          marked: true,
          selectedColor: colors.lightGray,
          dotColor: colors.black,
        },
      }
    : {};

  return (
    <View style={AppStyles.sessionContainer}>
      <Text style={AppStyles.sectionTitle}>BOOK YOUR SESSION</Text>

      <ScrollView contentContainerStyle={AppStyles.scrollContent}>
        <View style={AppStyles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            theme={{
              calendarBackground: colors.black,
              textSectionTitleColor: colors.lightGray,
              selectedDayBackgroundColor: colors.lightGray,
              selectedDayTextColor: colors.black,
              todayTextColor: '#ff0000',
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
                    !slot.available && AppStyles.timeSlotUnavailable,
                    selectedSlot === slot.time && AppStyles.timeSlotSelected
                  ]}
                  onPress={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                >
                  <Text style={[
                    AppStyles.timeSlotText,
                    !slot.available && AppStyles.timeSlotTextUnavailable,
                    selectedSlot === slot.time && AppStyles.timeSlotTextSelected
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {selectedSlot && (
              <TouchableOpacity 
                style={AppStyles.confirmButton}
                onPress={confirmBooking}
              >
                <Text style={AppStyles.confirmButtonText}>CONFIRM BOOKING</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      
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
              Your session on {selectedDate && new Date(selectedDate).toLocaleDateString()} at {selectedSlot} has been booked.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookSession;
