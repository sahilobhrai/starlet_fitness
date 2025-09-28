import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

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

const EarningsAndPayoutsScreen: React.FC = () => {
  const dummyEarningsData = generateDummyEarningsData();
  const totalMonthlyPayout = dummyEarningsData.reduce((sum, item) => sum + item.payout, 0);
  const totalSessions = dummyEarningsData.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Earnings and Payouts</Text>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Total Monthly Payout: ₹{totalMonthlyPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <Text style={styles.summaryText}>Total Sessions: {totalSessions}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Session</Text>
          <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Date</Text>
          <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Trainee Total</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Your Payout</Text>
        </View>
        {dummyEarningsData.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tableRowText, { flex: 0.8 }]} numberOfLines={1}>{item.session}</Text>
            <Text style={[styles.tableRowText, { flex: 1.2 }]} numberOfLines={1}>{item.date}</Text>
            <Text style={[styles.tableRowText, { flex: 1.2 }]} numberOfLines={1}>₹{item.traineeTotal.toLocaleString()}</Text>
            <Text style={[styles.tableRowText, { flex: 1 }]} numberOfLines={1}>₹{item.payout.toLocaleString()}</Text>
          </View>
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black, // Dark background
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white, // White text for dark background
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    backgroundColor: colors.darkGray, // Darker background for table
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary, // Primary color (black) for header
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableHeaderText: {
    flex: 1,
    color: colors.white, // White text for header
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray, // Medium gray for row borders
  },
  tableRowText: {
    flex: 1,
    color: colors.white, // White text for table rows
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: colors.darkGray, // Darker background for summary
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20, // Added gap below monthly payout
  },
  summaryText: {
    fontSize: 16,
    color: colors.white, // White text for summary
    marginBottom: 5,
  },
});

export default EarningsAndPayoutsScreen;
