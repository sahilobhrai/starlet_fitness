import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTrainerEarnings } from '../api';

type FilterType = '1month' | '3months' | '6months' | '1year' | 'all';

interface EarningItem {
  id: number;
  session_date: string;
  customer_name: string;
  session_amount: number;
  trainer_percent: number;
  trainer_earning: number;
  gym_earning: number;
  is_paid: boolean;
}

const EarningsAndPayoutsScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('1month');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningItem[]>([]);
  const [summary, setSummary] = useState({
    total_earnings: 0,
    total_sessions: 0,
    paid_earnings: 0,
    pending_earnings: 0,
  });

  useEffect(() => {
    fetchEarnings();
  }, [selectedFilter]);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const trainerId = await AsyncStorage.getItem('userId');
      if (trainerId) {
        const response = await getTrainerEarnings(trainerId, selectedFilter);
        console.log('Earnings Response:', response);

        if (response.code === '100') {
          setEarningsData(response.earnings || []);
          setSummary(response.summary || {
            total_earnings: 0,
            total_sessions: 0,
            paid_earnings: 0,
            pending_earnings: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case '1month': return '1 Month';
      case '3months': return '3 Months';
      case '6months': return '6 Months';
      case '1year': return '1 Year';
      case 'all': return 'All Time';
    }
  };

  const renderEarningsItem = ({ item }: { item: EarningItem }) => (
    <View style={styles.earningsCard}>
      <View style={styles.cardHeader}>
        <View style={styles.sessionInfo}>
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>{item.customer_name}</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(item.session_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.payoutHighlight}>
          <Text style={styles.payoutAmount}>₹{item.trainer_earning.toLocaleString()}</Text>
          <Text style={styles.payoutLabel}>
            {item.is_paid ? 'Paid' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="money" size={16} color={colors.bottleGreen} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.detailLabel}>Session Amount</Text>
              <Text style={styles.detailValue}>₹{item.session_amount.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Icon name="percent" size={16} color={colors.bottleGreen} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.detailLabel}>Your Share</Text>
              <Text style={styles.detailValue}>{item.trainer_percent}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.pageTitle}>Earnings & Payouts</Text>
            <Text style={styles.pageSubtitle}>Track your training sessions and earnings</Text>
          </View>
        </View>

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.red} />
            <Text style={{ color: colors.lightGray, marginTop: 10 }}>Loading earnings...</Text>
          </View>
        ) : (
          <>
            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Icon name="money" size={24} color={colors.bottleGreen} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Total Earnings</Text>
                  <Text style={styles.summaryValue}>₹{summary.total_earnings.toLocaleString()}</Text>
                  <Text style={styles.summarySubtext}>{getFilterLabel()}</Text>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Icon name="calendar-check-o" size={24} color={colors.bottleGreen} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Total Sessions</Text>
                  <Text style={styles.summaryValue}>{summary.total_sessions}</Text>
                  <Text style={styles.summarySubtext}>Completed</Text>
                </View>
              </View>
            </View>

            <View style={styles.summarySection}>
              <View style={[styles.summaryCard, { backgroundColor: '#1a3d1a' }]}>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Paid</Text>
                  <Text style={[styles.summaryValue, { color: '#4ecdc4' }]}>
                    ₹{summary.paid_earnings.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={[styles.summaryCard, { backgroundColor: '#3d1a1a' }]}>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Pending</Text>
                  <Text style={[styles.summaryValue, { color: '#f5576c' }]}>
                    ₹{summary.pending_earnings.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.earningsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Sessions</Text>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowFilterModal(true)}
                >
                  <Icon name="filter" size={16} color={colors.bottleGreen} />
                  <Text style={styles.filterText}>{getFilterLabel()}</Text>
                </TouchableOpacity>
              </View>

              {earningsData.length > 0 ? (
                <FlatList
                  data={earningsData}
                  renderItem={renderEarningsItem}
                  keyExtractor={item => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="line-chart" size={60} color={colors.mediumGray} />
                  <Text style={styles.emptyTitle}>No Earnings Yet</Text>
                  <Text style={styles.emptySubtitle}>Complete training sessions to start earning</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterModalTitle}>Filter Earnings</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)} style={styles.closeButton}>
                <Icon name="times" size={20} color={colors.lightGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              {(['1month', '3months', '6months', '1year', 'all'] as FilterType[]).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterOption, selectedFilter === filter && styles.filterOptionSelected]}
                  onPress={() => {
                    setSelectedFilter(filter);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={[styles.filterOptionText, selectedFilter === filter && styles.filterOptionTextSelected]}>
                    {filter === '1month' ? '1 Month' :
                     filter === '3months' ? '3 Months' :
                     filter === '6months' ? '6 Months' :
                     filter === '1year' ? '1 Year' : 'All Time'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  headerSection: { paddingHorizontal: 20, paddingVertical: 20, alignItems: 'center' },
  headerContent: { alignItems: 'center' },
  pageTitle: { fontSize: 28, fontWeight: '700', color: colors.lightGray, marginBottom: 8, textAlign: 'center' },
  pageSubtitle: { fontSize: 16, color: colors.mediumGray, textAlign: 'center', lineHeight: 22 },
  summarySection: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  summaryCard: { flex: 1, backgroundColor: colors.darkGray, borderRadius: 16, padding: 16, marginHorizontal: 5, alignItems: 'center', elevation: 8 },
  summaryIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.bottleGreen + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  summaryContent: { alignItems: 'center' },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: colors.mediumGray, marginBottom: 4, textAlign: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '700', color: colors.lightGray, marginBottom: 2, textAlign: 'center' },
  summarySubtext: { fontSize: 10, color: colors.mediumGray, textAlign: 'center', opacity: 0.8 },
  earningsSection: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: colors.lightGray },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.darkGray, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  filterText: { fontSize: 12, color: colors.bottleGreen, marginLeft: 4, fontWeight: '600' },
  earningsCard: { backgroundColor: colors.darkGray, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 3, borderWidth: 1, borderColor: colors.mediumGray + '20' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  sessionInfo: { flex: 1 },
  sessionBadge: { backgroundColor: colors.bottleGreen + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 6 },
  sessionBadgeText: { fontSize: 12, color: colors.bottleGreen, fontWeight: '700' },
  dateText: { fontSize: 14, color: colors.mediumGray, fontWeight: '500' },
  payoutHighlight: { alignItems: 'flex-end' },
  payoutAmount: { fontSize: 18, fontWeight: '700', color: colors.bottleGreen, marginBottom: 2 },
  payoutLabel: { fontSize: 10, color: colors.mediumGray, fontWeight: '600' },
  cardDetails: { borderTopWidth: 1, borderTopColor: colors.mediumGray + '30', paddingTop: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  detailLabel: { fontSize: 10, color: colors.mediumGray, fontWeight: '600', marginBottom: 2 },
  detailValue: { fontSize: 12, color: colors.lightGray, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.mediumGray, marginBottom: 8, marginTop: 20, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: colors.mediumGray, textAlign: 'center', opacity: 0.8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  filterModal: { backgroundColor: colors.darkGray, borderRadius: 20, padding: 20, width: '80%', maxWidth: 320, borderWidth: 1, borderColor: colors.mediumGray + '30' },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  filterModalTitle: { fontSize: 20, fontWeight: '700', color: colors.lightGray },
  closeButton: { padding: 5 },
  filterOptions: { gap: 12 },
  filterOption: { backgroundColor: colors.black, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.mediumGray + '30' },
  filterOptionSelected: { backgroundColor: colors.bottleGreen + '20', borderColor: colors.bottleGreen },
  filterOptionText: { fontSize: 16, fontWeight: '600', color: colors.lightGray, textAlign: 'center' },
  filterOptionTextSelected: { color: colors.bottleGreen },
});

export default EarningsAndPayoutsScreen;
