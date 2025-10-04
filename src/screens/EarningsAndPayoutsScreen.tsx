import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

const generateDummyEarningsData = () => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) { // Generate data for 30 days
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    const sessionsPerDay = Math.floor(Math.random() * 4) + 3; // 3 to 6 sessions per day
    for (let j = 0; j < sessionsPerDay; j++) {
      const traineeTotal = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000; // $5000 - $20000
      const trainerPercentage = 0.01; // 1%
      const payout = traineeTotal * trainerPercentage;
      data.push({
        id: `${dateString}-${j}`,
        session: `${j + 1}`, // Changed from "Session X" to just "X"
        date: dateString,
        traineeTotal: traineeTotal,
        trainerPercentage: trainerPercentage,
        payout: payout,
      });
    }
  }
  return data;
};

type FilterType = '1month' | '6months' | 'alltime';

const EarningsAndPayoutsScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('1month');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const dummyEarningsData = generateDummyEarningsData();

  // Filter data based on selected time period
  const getFilteredData = () => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (selectedFilter) {
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case 'alltime':
        return dummyEarningsData;
    }

    return dummyEarningsData.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();
  const totalFilteredPayout = filteredData.reduce((sum, item) => sum + item.payout, 0);
  const totalFilteredSessions = filteredData.length;

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case '1month': return '1 Month';
      case '6months': return '6 Months';
      case 'alltime': return 'All Time';
    }
  };

  const renderEarningsItem = ({ item }: { item: any }) => (
    <View style={styles.earningsCard}>
      <View style={styles.cardHeader}>
        <View style={styles.sessionInfo}>
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>Session {item.session}</Text>
          </View>
          <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.payoutHighlight}>
          <Text style={styles.payoutAmount}>₹{item.payout.toLocaleString()}</Text>
          <Text style={styles.payoutLabel}>Your Earnings</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>💰</Text>
            <View>
              <Text style={styles.detailLabel}>Trainee Total</Text>
              <Text style={styles.detailValue}>₹{item.traineeTotal.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📊</Text>
            <View>
              <Text style={styles.detailLabel}>Your Share</Text>
              <Text style={styles.detailValue}>{item.trainerPercentage * 100}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={AppStyles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.pageTitle}>💰 Earnings & Payouts</Text>
            <Text style={styles.pageSubtitle}>Track your training sessions and earnings</Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>💵</Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
              <Text style={styles.summaryValue}>₹{totalFilteredPayout.toLocaleString()}</Text>
              <Text style={styles.summarySubtext}>{getFilterLabel()}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>🏋️</Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Total Sessions</Text>
              <Text style={styles.summaryValue}>{totalFilteredSessions}</Text>
              <Text style={styles.summarySubtext}>In {getFilterLabel().toLowerCase()}</Text>
            </View>
          </View>
        </View>

        {/* Earnings List */}
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

          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderEarningsItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>📈</Text>
              </View>
              <Text style={styles.emptyTitle}>No Earnings Yet</Text>
              <Text style={styles.emptySubtitle}>Complete training sessions to start earning</Text>
              <View style={styles.emptyTip}>
                <Text style={styles.emptyTipText}>💡 Tip: Each session earns you 1% of trainee fees</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
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
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.closeButton}
              >
                <Icon name="times" size={20} color={colors.lightGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedFilter === '1month' && styles.filterOptionSelected
                ]}
                onPress={() => {
                  setSelectedFilter('1month');
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === '1month' && styles.filterOptionTextSelected
                ]}>📅 1 Month</Text>
                <Text style={[
                  styles.filterOptionSubtext,
                  selectedFilter === '1month' && styles.filterOptionSubtextSelected
                ]}>Last 30 days</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedFilter === '6months' && styles.filterOptionSelected
                ]}
                onPress={() => {
                  setSelectedFilter('6months');
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === '6months' && styles.filterOptionTextSelected
                ]}>📊 6 Months</Text>
                <Text style={[
                  styles.filterOptionSubtext,
                  selectedFilter === '6months' && styles.filterOptionSubtextSelected
                ]}>Last 180 days</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedFilter === 'alltime' && styles.filterOptionSelected
                ]}
                onPress={() => {
                  setSelectedFilter('alltime');
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === 'alltime' && styles.filterOptionTextSelected
                ]}>📈 All Time</Text>
                <Text style={[
                  styles.filterOptionSubtext,
                  selectedFilter === 'alltime' && styles.filterOptionSubtextSelected
                ]}>Complete history</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container and Layout
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  // Header Section
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center' as const,
  },
  headerContent: {
    alignItems: 'center' as const,
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

  // Summary Section
  summarySection: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.bottleGreen + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  summaryIconText: {
    fontSize: 24,
  },
  summaryContent: {
    alignItems: 'center' as const,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.mediumGray,
    marginBottom: 4,
    textAlign: 'center' as const,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 2,
    textAlign: 'center' as const,
  },
  summarySubtext: {
    fontSize: 10,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    opacity: 0.8,
  },

  // Earnings Section
  earningsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.lightGray,
  },
  filterButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.darkGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 12,
    color: colors.bottleGreen,
    marginLeft: 4,
    fontWeight: '600' as const,
  },

  // Earnings Cards
  earningsCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionBadge: {
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
    marginBottom: 6,
  },
  sessionBadgeText: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: '700' as const,
  },
  dateText: {
    fontSize: 14,
    color: colors.mediumGray,
    fontWeight: '500' as const,
  },
  payoutHighlight: {
    alignItems: 'flex-end' as const,
  },
  payoutAmount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.bottleGreen,
    marginBottom: 2,
  },
  payoutLabel: {
    fontSize: 10,
    color: colors.mediumGray,
    fontWeight: '600' as const,
  },

  // Card Details
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray + '30',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  detailItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.mediumGray,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    color: colors.lightGray,
    fontWeight: '700' as const,
  },

  // Empty State
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bottleGreen + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.mediumGray,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    opacity: 0.8,
    marginBottom: 16,
  },
  emptyTip: {
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptyTipText: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },

  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  filterModal: {
    backgroundColor: colors.darkGray,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.mediumGray + '30',
  },
  filterHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.lightGray,
  },
  closeButton: {
    padding: 5,
  },
  filterOptions: {
    gap: 12,
  },
  filterOption: {
    backgroundColor: colors.black,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.mediumGray + '30',
  },
  filterOptionSelected: {
    backgroundColor: colors.bottleGreen + '20',
    borderColor: colors.bottleGreen,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.lightGray,
    marginBottom: 4,
  },
  filterOptionTextSelected: {
    color: colors.bottleGreen,
  },
  filterOptionSubtext: {
    fontSize: 12,
    color: colors.mediumGray,
  },
  filterOptionSubtextSelected: {
    color: colors.bottleGreen + 'CC',
  },
});

export default EarningsAndPayoutsScreen;
