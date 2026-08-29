import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClientAvailableSlots, bookSession, cancelSession, getClientSessions, generateSessionQR } from '../api';

// Keep in sync with QR_WINDOW_BEFORE / QR_WINDOW_AFTER in the backend (startlet/views.py)
const QR_WINDOW_BEFORE_MS = 15 * 60 * 1000;
const QR_WINDOW_AFTER_MS = 90 * 60 * 1000;
const QR_REFRESH_INTERVAL_MS = 80 * 1000; // refresh before the backend's 120s token expiry

const { width } = Dimensions.get('window');

const now = new Date();
const todayString = now.toISOString().split('T')[0];

interface BackendSlot {
  id: number;
  branch: number;
  branch_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  booked_by: number | null;
  booked_by_name: string | null;
  created_at: string;
}

interface TimeSlot {
  id: number;
  time: string;
  endTime: string;
  status: string;
  isAvailable: boolean;
}

interface CalendarMarking {
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
}

interface BookedSession {
  id: number;
  date: string;
  time: string;
  status: string;
  trainer_name: string | null;
}

const BookSession = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState<boolean>(false);
  const [selectedSessionToCancel, setSelectedSessionToCancel] = useState<BookedSession | null>(null);
  const [myBookings, setMyBookings] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDayOff, setIsDayOff] = useState<boolean>(false);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState<boolean>(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrBooking, setQrBooking] = useState<BookedSession | null>(null);
  const qrRefreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const branch = await AsyncStorage.getItem('userBranch');
      const userId = await AsyncStorage.getItem('userId');
      setBranchId(branch);
      setClientId(userId);

      // Fetch user's booked sessions
      if (userId) {
        fetchMyBookings(userId);
      }
    };
    loadUserData();
  }, []);

  // Fetch user's bookings
  const fetchMyBookings = async (userId: string) => {
    try {
      const response = await getClientSessions(userId);
      if (response.code === '100' && response.sessions) {
        const bookedSessions = response.sessions
          .filter((s: any) => s.status === 'Scheduled' || s.status === 'In Progress')
          .map((s: any) => ({
            id: s.id,
            date: s.session_date.split('T')[0],
            time: s.session_date.split('T')[1]?.substring(0, 5) || '',
            status: s.status,
            trainer_name: s.trainer_name
          }));
        setMyBookings(bookedSessions);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate && branchId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, branchId]);

  const fetchAvailableSlots = async () => {
    if (!branchId || !selectedDate) return;

    setIsLoading(true);
    try {
      const response = await getClientAvailableSlots(branchId, selectedDate);
      console.log('Available slots response:', response);

      if (response.code === '100') {
        setIsDayOff(response.is_day_off || false);

        if (response.slots && response.slots.length > 0) {
          const formattedSlots: TimeSlot[] = response.slots.map((slot: BackendSlot) => ({
            id: slot.id,
            time: slot.start_time.substring(0, 5), // HH:MM
            endTime: slot.end_time.substring(0, 5),
            status: slot.status,
            isAvailable: slot.status === 'AVAILABLE'
          }));
          setTimeSlots(formattedSlots);
        } else {
          setTimeSlots([]);
        }
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setTimeSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot);
    }
  };

  const handleConfirmBookingPress = () => {
    if (selectedDate && selectedSlot) {
      setShowConfirmationModal(true);
    }
  };

  const handleFinalBooking = async () => {
    if (!selectedDate || !selectedSlot || !clientId) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    setIsLoading(true);
    try {
      const response = await bookSession(clientId, selectedSlot.id, null, '');
      console.log('Booking response:', response);

      if (response.code === '100') {
        setBookingConfirmed(true);
        setShowConfirmationModal(false);

        // Refresh bookings and slots
        await fetchMyBookings(clientId);
        await fetchAvailableSlots();

        setTimeout(() => {
          setBookingConfirmed(false);
          setSelectedSlot(null);
        }, 3000);
      } else {
        Alert.alert('Booking Failed', response.error || 'Failed to book session');
        setShowConfirmationModal(false);
      }
    } catch (error) {
      console.error('Error booking session:', error);
      Alert.alert('Error', 'Failed to book session. Please try again.');
      setShowConfirmationModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!selectedSessionToCancel || !clientId) return;

    setIsLoading(true);
    try {
      const response = await cancelSession(selectedSessionToCancel.id, clientId);
      console.log('Cancel response:', response);

      if (response.code === '100') {
        Alert.alert('Success', 'Session cancelled successfully');
        await fetchMyBookings(clientId);
        if (selectedDate) {
          await fetchAvailableSlots();
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to cancel session');
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
      Alert.alert('Error', 'Failed to cancel session');
    } finally {
      setIsLoading(false);
      setShowCancelConfirmModal(false);
      setSelectedSessionToCancel(null);
    }
  };

  // Check if a session can be cancelled (4 hours before)
  const canCancelSession = (session: BookedSession) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
    const hoursDiff = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff >= 4;
  };

  // A session's check-in QR can be generated shortly before it starts, through a window after
  const isSessionActive = (session: BookedSession) => {
    if (session.status !== 'Scheduled' && session.status !== 'In Progress') return false;
    const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
    const nowTime = Date.now();
    return (
      nowTime >= sessionDateTime.getTime() - QR_WINDOW_BEFORE_MS &&
      nowTime <= sessionDateTime.getTime() + QR_WINDOW_AFTER_MS
    );
  };

  const requestQrToken = async (session: BookedSession) => {
    if (!clientId) return;
    try {
      const response = await generateSessionQR(session.id, clientId);
      if (response.code === '100' && response.token) {
        setQrToken(response.token);
        setQrError(null);
      } else {
        setQrError(response.error || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating session QR:', error);
      setQrError('Failed to generate QR code');
    }
  };

  const handleGenerateQr = async (session: BookedSession) => {
    setQrBooking(session);
    setQrModalVisible(true);
    setQrLoading(true);
    setQrToken(null);
    setQrError(null);

    await requestQrToken(session);
    setQrLoading(false);

    if (qrRefreshTimer.current) clearInterval(qrRefreshTimer.current);
    qrRefreshTimer.current = setInterval(() => {
      requestQrToken(session);
    }, QR_REFRESH_INTERVAL_MS);
  };

  const closeQrModal = () => {
    if (qrRefreshTimer.current) {
      clearInterval(qrRefreshTimer.current);
      qrRefreshTimer.current = null;
    }
    setQrModalVisible(false);
    setQrToken(null);
    setQrBooking(null);
    setQrError(null);
  };

  useEffect(() => {
    return () => {
      if (qrRefreshTimer.current) clearInterval(qrRefreshTimer.current);
    };
  }, []);

  // Calculate date range for calendar
  const sixDaysFromNow = new Date();
  sixDaysFromNow.setDate(now.getDate() + 6);
  const sixDaysFromNowString = sixDaysFromNow.toISOString().split('T')[0];

  // Create calendar markings
  const markedDates: Record<string, CalendarMarking> = {};

  myBookings.forEach((booking) => {
    markedDates[booking.date] = { marked: true, dotColor: colors.red };
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: colors.lightGray,
    };
  }

  return (
    <View style={AppStyles.sessionContainer}>
      <Text style={AppStyles.sectionTitle}>BOOK YOUR SESSION</Text>

      <ScrollView contentContainerStyle={AppStyles.scrollContent}>
        <View style={AppStyles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            minDate={todayString}
            maxDate={sixDaysFromNowString}
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

        {/* Information section when no date is selected */}
        {!selectedDate && (
          <View style={AppStyles.infoSectionContainer}>
            <View style={AppStyles.infoCard}>
              <View style={AppStyles.infoHeader}>
                <Icon name="star" size={24} color={colors.lightGray} style={AppStyles.infoIcon} />
                <Text style={AppStyles.infoTitle}>Welcome to Starlet Fitness</Text>
              </View>
              <Text style={AppStyles.infoText}>
                Book your personalized training sessions with our expert trainers. Choose from individual or group sessions tailored to your fitness goals.
              </Text>
            </View>

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

            <View style={AppStyles.infoCard}>
              <View style={AppStyles.infoHeader}>
                <Icon name="lightbulb-o" size={24} color={colors.lightGray} style={AppStyles.infoIcon} />
                <Text style={AppStyles.infoTitle}>Booking Tips</Text>
              </View>
              <View style={AppStyles.tipsList}>
                <Text style={AppStyles.tipItem}>Book sessions at least 4 hours in advance</Text>
                <Text style={AppStyles.tipItem}>Cancellations must be made 4+ hours before the session</Text>
                <Text style={AppStyles.tipItem}>Green slots indicate availability</Text>
                <Text style={AppStyles.tipItem}>Red dots show dates with existing bookings</Text>
              </View>
            </View>
          </View>
        )}

        {selectedDate && (
          <View style={AppStyles.timeSlotsContainer}>
            <Text style={AppStyles.timeSlotsTitle}>
              Available slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>

            {isLoading ? (
              <ActivityIndicator size="large" color={colors.lightGray} style={{ marginTop: 20 }} />
            ) : isDayOff ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Icon name="calendar-times-o" size={50} color={colors.mediumGray} />
                <Text style={{ color: colors.lightGray, fontSize: 16, marginTop: 10 }}>
                  This day is marked as off. No sessions available.
                </Text>
              </View>
            ) : timeSlots.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Icon name="clock-o" size={50} color={colors.mediumGray} />
                <Text style={{ color: colors.lightGray, fontSize: 16, marginTop: 10 }}>
                  No available slots for this date.
                </Text>
              </View>
            ) : (
              <View style={AppStyles.timeSlotsGrid}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      AppStyles.timeSlot,
                      !slot.isAvailable && AppStyles.timeSlotBooked,
                      slot.isAvailable && AppStyles.timeSlotTwoAvailable,
                      selectedSlot?.id === slot.id && AppStyles.timeSlotSelected
                    ]}
                    onPress={() => handleSlotSelect(slot)}
                    disabled={!slot.isAvailable}
                  >
                    <Text style={[
                      AppStyles.timeSlotText,
                      !slot.isAvailable && AppStyles.timeSlotTextBooked,
                      slot.isAvailable && AppStyles.timeSlotTextTwoAvailable,
                      selectedSlot?.id === slot.id && AppStyles.timeSlotTextSelected
                    ]}>
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedSlot && (
              <TouchableOpacity
                style={AppStyles.confirmButton}
                onPress={handleConfirmBookingPress}
              >
                <Text style={AppStyles.confirmButtonText}>CONFIRM BOOKING</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* My Bookings Section */}
        {myBookings.length > 0 && (
          <View style={AppStyles.myBookingsContainer}>
            <Text style={AppStyles.sectionTitle}>MY BOOKINGS</Text>
            {myBookings.map((booking) => {
              const isCancellable = canCancelSession(booking);
              const isActive = isSessionActive(booking);

              return (
                <View key={booking.id} style={AppStyles.bookingItem}>
                  <View>
                    <Text style={AppStyles.bookingText}>
                      {booking.date} at {booking.time}
                    </Text>
                    {booking.trainer_name && (
                      <Text style={{ color: colors.mediumGray, fontSize: 12 }}>
                        Trainer: {booking.trainer_name}
                      </Text>
                    )}
                    <Text style={{ color: colors.lightGreen, fontSize: 12 }}>
                      Status: {booking.status}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={[
                        AppStyles.bookingCancelButton,
                        { backgroundColor: colors.bottleGreen, marginRight: 8, flexDirection: 'row', alignItems: 'center' },
                        !isActive && AppStyles.bookingCancelButtonDisabled
                      ]}
                      onPress={() => {
                        if (isActive) handleGenerateQr(booking);
                      }}
                      disabled={!isActive}
                    >
                      <Icon name="qrcode" size={14} color={colors.lightGray} />
                      <Text style={[AppStyles.bookingCancelButtonText, { marginLeft: 6 }]}>
                        {isActive ? 'Generate QR' : 'Not Active'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        AppStyles.bookingCancelButton,
                        !isCancellable && AppStyles.bookingCancelButtonDisabled
                      ]}
                      onPress={() => {
                        if (isCancellable) {
                          setSelectedSessionToCancel(booking);
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
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Booking Confirmation Modal */}
      <Modal visible={showConfirmationModal} transparent={true} animationType="fade">
        <View style={AppStyles.modalContainer}>
          <View style={[AppStyles.modalContent, { padding: 20 }]}>
            <Text style={[AppStyles.modalTitle, { marginBottom: 10 }]}>Confirm Booking</Text>
            <Text style={[AppStyles.modalText, { marginBottom: 20 }]}>
              Are you sure you want to book this session?
            </Text>
            <Text style={[AppStyles.modalText, { marginBottom: 10, fontWeight: 'bold' }]}>
              Date: {selectedDate && new Date(selectedDate).toLocaleDateString()}
            </Text>
            <Text style={[AppStyles.modalText, { marginBottom: 20, fontWeight: 'bold' }]}>
              Time: {selectedSlot?.time} - {selectedSlot?.endTime}
            </Text>
            <Text style={[AppStyles.modalText, { marginBottom: 20, color: colors.mediumGray }]}>
              Note: Cancellations must be made at least 4 hours before the session.
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <TouchableOpacity
                style={[AppStyles.confirmButton, AppStyles.modalButton]}
                onPress={handleFinalBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.lightGray} size="small" />
                ) : (
                  <Text style={AppStyles.confirmButtonText}>CONFIRM</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[AppStyles.cancelButton, AppStyles.modalButton]}
                onPress={() => {
                  setShowConfirmationModal(false);
                  setSelectedSlot(null);
                }}
              >
                <Text style={AppStyles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Booking Success Modal */}
      <Modal visible={bookingConfirmed} transparent={true} animationType="fade">
        <View style={AppStyles.modalContainer}>
          <View style={AppStyles.modalContent}>
            <Text style={{ fontSize: 60, color: '#00ff00' }}>&#10003;</Text>
            <Text style={AppStyles.modalTitle}>BOOKING CONFIRMED!</Text>
            <Text style={AppStyles.modalText}>
              Your session on {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'N/A'} at {selectedSlot?.time || 'N/A'} has been booked.
            </Text>
            <TouchableOpacity
              style={AppStyles.confirmButton}
              onPress={() => {
                setBookingConfirmed(false);
                setSelectedSlot(null);
              }}
            >
              <Text style={AppStyles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal visible={showCancelConfirmModal} transparent={true} animationType="fade">
        <View style={AppStyles.modalContainer}>
          <View style={[AppStyles.modalContent, { padding: 20 }]}>
            <Text style={[AppStyles.modalTitle, { marginBottom: 10 }]}>Cancel Session</Text>
            <Text style={[AppStyles.modalText, { marginBottom: 20 }]}>
              Are you sure you want to cancel your session on {selectedSessionToCancel?.date} at {selectedSessionToCancel?.time}?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <TouchableOpacity
                style={[AppStyles.confirmButton, AppStyles.modalButton, { backgroundColor: colors.red }]}
                onPress={handleCancelSession}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={AppStyles.confirmButtonText}>YES, CANCEL</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[AppStyles.cancelButton, AppStyles.modalButton]}
                onPress={() => {
                  setShowCancelConfirmModal(false);
                  setSelectedSessionToCancel(null);
                }}
              >
                <Text style={AppStyles.cancelButtonText}>NO, GO BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Session Check-In QR Modal */}
      <Modal visible={qrModalVisible} transparent={true} animationType="fade" onRequestClose={closeQrModal}>
        <View style={AppStyles.modalContainer}>
          <View style={[AppStyles.modalContent, { padding: 20 }]}>
            <Text style={[AppStyles.modalTitle, { marginBottom: 10 }]}>Session Check-In</Text>
            {qrBooking && (
              <Text style={[AppStyles.modalText, { marginBottom: 15 }]}>
                {qrBooking.date} at {qrBooking.time}
              </Text>
            )}

            {qrLoading ? (
              <ActivityIndicator size="large" color={colors.lightGray} style={{ marginVertical: 30 }} />
            ) : qrError ? (
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Icon name="exclamation-circle" size={40} color={colors.red} />
                <Text style={[AppStyles.modalText, { marginTop: 10, textAlign: 'center' }]}>{qrError}</Text>
              </View>
            ) : qrToken ? (
              <View style={{ backgroundColor: colors.white, padding: 16, borderRadius: 10, marginVertical: 10 }}>
                <QRCode value={qrToken} size={200} />
              </View>
            ) : null}

            <Text style={[AppStyles.modalText, { marginTop: 10, marginBottom: 20, color: colors.mediumGray, textAlign: 'center' }]}>
              Show this to your trainer to check in. It refreshes automatically.
            </Text>

            <TouchableOpacity
              style={[AppStyles.cancelButton, AppStyles.modalButton]}
              onPress={closeQrModal}
            >
              <Text style={AppStyles.cancelButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookSession;
