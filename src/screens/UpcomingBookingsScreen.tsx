import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Linking, Alert, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTrainerUpcomingSessions, startSession, endSession } from '../api';

interface UpcomingBookingsScreenProps {
  navigation: any;
}

interface SessionCheckIn {
  id: number;
  trainer: number;
  trainer_name: string;
  scanned_at: string;
}

interface Session {
  id: number;
  customer_name: string;
  customer_phone: string;
  session_date: string;
  status: string;
  person_count: number;
  notes: string | null;
  check_ins?: SessionCheckIn[];
}

const UpcomingBookingsScreen = ({ navigation: _navigation }: UpcomingBookingsScreenProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEndSessionModalVisible, setIsEndSessionModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionAmount, setSessionAmount] = useState('500');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const trainerId = await AsyncStorage.getItem('userId');
      if (trainerId) {
        const response = await getTrainerUpcomingSessions(trainerId);
        console.log('Upcoming Sessions Response:', response);

        if (response.code === '100' && response.sessions) {
          setSessions(response.sessions);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    const phoneUrl = `tel:+91${phone}`;
    Linking.openURL(phoneUrl).catch(err => {
      console.error('Failed to open dialer:', err);
      Alert.alert('Error', 'Unable to make phone call.');
    });
  };

  const handleStartSession = async (session: Session) => {
    setActionLoading(true);
    try {
      const response = await startSession(session.id);
      if (response.code === '100') {
        Alert.alert('Success', 'Session started!');
        fetchSessions();
      } else {
        Alert.alert('Error', response.error || 'Failed to start session');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      Alert.alert('Error', 'Failed to start session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndSessionPress = (session: Session) => {
    setSelectedSession(session);
    setIsEndSessionModalVisible(true);
  };

  const handleFinishSession = async () => {
    if (!selectedSession) return;

    setActionLoading(true);
    try {
      const response = await endSession(selectedSession.id, parseFloat(sessionAmount) || 500);
      if (response.code === '100') {
        Alert.alert('Success', 'Session ended successfully! Earnings recorded.');
        setIsEndSessionModalVisible(false);
        setSelectedSession(null);
        fetchSessions();
      } else {
        Alert.alert('Error', response.error || 'Failed to end session');
      }
    } catch (error) {
      console.error('Error ending session:', error);
      Alert.alert('Error', 'Failed to end session');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const renderSessionItem = ({ item }: { item: Session }) => {
    const { date, time } = formatDateTime(item.session_date);
    const isInProgress = item.status === 'In Progress';

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View style={styles.customerInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{item.customer_name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{item.customer_name}</Text>
              <View style={[styles.sessionTypeBadge, isInProgress && { backgroundColor: '#ffc10720' }]}>
                <Text style={[styles.sessionTypeText, isInProgress && { color: '#ffc107' }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdText}>{item.person_count} person(s)</Text>
          </View>
        </View>

        <View style={styles.bookingInfo}>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={16} color={colors.bottleGreen} />
              <Text style={styles.dateTimeText}>{date}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Icon name="clock-o" size={16} color={colors.bottleGreen} />
              <Text style={styles.dateTimeText}>{time}</Text>
            </View>
          </View>
        </View>

        {item.check_ins && item.check_ins.length > 0 && (
          <View style={styles.checkInsContainer}>
            <Icon name="qrcode" size={14} color={colors.bottleGreen} />
            <Text style={styles.checkInsText}>
              Checked in: {item.check_ins.map(c => c.trainer_name).join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.customer_phone)}>
            <Icon name="phone" size={16} color={colors.lightGray} />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>

          {item.status === 'Scheduled' ? (
            <TouchableOpacity
              style={[styles.endButton, { backgroundColor: colors.bottleGreen }]}
              onPress={() => handleStartSession(item)}
              disabled={actionLoading}
            >
              <Icon name="play" size={16} color={colors.lightGray} />
              <Text style={styles.endButtonText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endButton} onPress={() => handleEndSessionPress(item)} disabled={actionLoading}>
              <Icon name="check-circle" size={16} color={colors.black} />
              <Text style={[styles.endButtonText, { color: colors.black }]}>End</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="calendar" size={60} color={colors.mediumGray} />
      <Text style={styles.emptyStateTitle}>No Upcoming Sessions</Text>
      <Text style={styles.emptyStateSubtitle}>All your sessions are completed!</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.red} />
        <Text style={{ color: colors.lightGray, marginTop: 10 }}>Loading sessions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={AppStyles.mainContent}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Upcoming Sessions</Text>
          <Text style={styles.pageSubtitle}>Manage your scheduled training sessions</Text>
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Scheduled ({sessions.length})</Text>
            <TouchableOpacity onPress={fetchSessions}>
              <Icon name="refresh" size={20} color={colors.bottleGreen} />
            </TouchableOpacity>
          </View>

          {sessions.length > 0 ? (
            <FlatList
              data={sessions}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>

      <Modal visible={isEndSessionModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsEndSessionModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>End Session</Text>

            {selectedSession && (
              <View style={styles.bookingSummary}>
                <Text style={styles.bookingSummaryTitle}>Session Details:</Text>
                <Text style={styles.bookingSummaryText}>
                  {selectedSession.customer_name} - {formatDateTime(selectedSession.session_date).date}
                </Text>
              </View>
            )}

            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: colors.lightGray, marginBottom: 10 }}>Session Amount (INR):</Text>
              <View style={{ backgroundColor: colors.black, borderRadius: 10, padding: 15 }}>
                <Text style={{ color: colors.lightGray, fontSize: 18 }}>₹ {sessionAmount}</Text>
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsEndSessionModalVisible(false)}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalFinishButton} onPress={handleFinishSession} disabled={actionLoading}>
                {actionLoading ? (
                  <ActivityIndicator color={colors.lightGray} size="small" />
                ) : (
                  <Text style={styles.modalFinishButtonText}>Complete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  headerSection: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: colors.lightGray, marginBottom: 8, textAlign: 'center' },
  pageSubtitle: { fontSize: 16, color: colors.mediumGray, textAlign: 'center', lineHeight: 22 },
  listSection: { paddingHorizontal: 20, paddingBottom: 100 },
  listHeader: { marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listTitle: { fontSize: 22, fontWeight: '700', color: colors.lightGray },
  bookingCard: { backgroundColor: colors.darkGray, borderRadius: 16, marginBottom: 15, padding: 20, elevation: 8, borderWidth: 1, borderColor: colors.mediumGray + '20' },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  customerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.bottleGreen, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: colors.lightGray },
  customerDetails: { flex: 1 },
  customerName: { fontSize: 20, fontWeight: '700', color: colors.lightGray, marginBottom: 5 },
  sessionTypeBadge: { backgroundColor: colors.bottleGreen + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  sessionTypeText: { fontSize: 12, color: colors.bottleGreen, fontWeight: 'bold' },
  bookingIdContainer: { backgroundColor: colors.lightGray + '10', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  bookingIdText: { fontSize: 12, color: colors.lightGray, fontWeight: 'bold' },
  bookingInfo: { marginBottom: 20 },
  checkInsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkInsText: { color: colors.mediumGray, fontSize: 13, marginLeft: 8 },
  dateTimeContainer: { backgroundColor: colors.black + '40', borderRadius: 12, padding: 15 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timeContainer: { flexDirection: 'row', alignItems: 'center' },
  dateTimeText: { fontSize: 16, color: colors.lightGray, marginLeft: 8, fontWeight: '600' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.mediumGray + '30', paddingTop: 15 },
  callButton: { backgroundColor: colors.bottleGreen, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, marginRight: 10 },
  callButtonText: { color: colors.lightGray, fontSize: 14, fontWeight: '700', marginLeft: 8 },
  endButton: { backgroundColor: '#ffc107', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, marginLeft: 10 },
  endButtonText: { color: colors.lightGray, fontSize: 14, fontWeight: '700', marginLeft: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyStateTitle: { fontSize: 22, fontWeight: '700', color: colors.mediumGray, marginBottom: 10, marginTop: 20, textAlign: 'center' },
  emptyStateSubtitle: { fontSize: 16, color: colors.mediumGray, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.darkGray, borderRadius: 20, padding: 20, width: '90%', maxHeight: '85%', borderWidth: 1, borderColor: colors.bottleGreen + '40' },
  modalTitle: { fontSize: 24, fontWeight: '700', color: colors.lightGray, textAlign: 'center', marginBottom: 10 },
  bookingSummary: { backgroundColor: colors.black + '40', borderRadius: 12, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: colors.bottleGreen + '30' },
  bookingSummaryTitle: { fontSize: 16, fontWeight: '700', color: colors.bottleGreen, marginBottom: 8 },
  bookingSummaryText: { fontSize: 14, color: colors.lightGray, lineHeight: 20 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  modalCancelButton: { backgroundColor: colors.mediumGray, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12, flex: 1, alignItems: 'center' },
  modalCancelButtonText: { color: colors.lightGray, fontSize: 16, fontWeight: '700' },
  modalFinishButton: { backgroundColor: colors.bottleGreen, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12, flex: 1, alignItems: 'center' },
  modalFinishButtonText: { color: colors.lightGray, fontSize: 16, fontWeight: '700' },
});

export default UpcomingBookingsScreen;
