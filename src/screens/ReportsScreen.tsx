import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReports } from '../api';

const ReportsScreen = ({ navigation }: { navigation: any }) => {
    const [reportType, setReportType] = useState<'overview' | 'sessions' | 'revenue'>('overview');
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => {
        fetchReports();
    }, [reportType]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const branchId = await AsyncStorage.getItem('userBranch');
            const response = await getReports(branchId, reportType);
            console.log('Reports Response:', response);

            if (response.code === '100' && response.report) {
                setReportData(response.report);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderOverviewReport = () => (
        <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>Business Overview</Text>
                <View style={styles.reportBadge}>
                    <Text style={styles.reportBadgeText}>Current Period</Text>
                </View>
            </View>

            {reportData && (
                <View style={styles.reportStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Sessions</Text>
                        <Text style={styles.statValue}>{reportData.total_sessions || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Completed Sessions</Text>
                        <Text style={styles.statValue}>{reportData.completed_sessions || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Cancelled Sessions</Text>
                        <Text style={styles.statValue}>{reportData.cancelled_sessions || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Revenue</Text>
                        <Text style={styles.statValue}>₹{(reportData.total_revenue || 0).toLocaleString()}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Trainers</Text>
                        <Text style={styles.statValue}>{reportData.total_trainers || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Clients</Text>
                        <Text style={styles.statValue}>{reportData.total_clients || 0}</Text>
                    </View>
                </View>
            )}

            <TouchableOpacity onPress={() => Alert.alert('Report', 'Exporting report...')} style={styles.exportButton}>
                <Text style={styles.exportButtonText}>Export Report</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSessionsReport = () => (
        <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>Sessions Report</Text>
                <View style={styles.reportBadge}>
                    <Text style={styles.reportBadgeText}>Monthly</Text>
                </View>
            </View>

            {reportData && reportData.sessions_by_status && (
                <View style={styles.reportStats}>
                    {Object.entries(reportData.sessions_by_status).map(([status, count]: [string, any]) => (
                        <View key={status} style={styles.statItem}>
                            <Text style={styles.statLabel}>{status}</Text>
                            <Text style={styles.statValue}>{count}</Text>
                        </View>
                    ))}
                </View>
            )}

            <TouchableOpacity onPress={() => Alert.alert('Report', 'Exporting...')} style={styles.exportButton}>
                <Text style={styles.exportButtonText}>Export Report</Text>
            </TouchableOpacity>
        </View>
    );

    const renderRevenueReport = () => (
        <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>Revenue Report</Text>
                <View style={styles.reportBadge}>
                    <Text style={styles.reportBadgeText}>Monthly</Text>
                </View>
            </View>

            {reportData && (
                <View style={styles.reportStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Revenue</Text>
                        <Text style={styles.statValue}>₹{(reportData.total_revenue || 0).toLocaleString()}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Trainer Payouts</Text>
                        <Text style={styles.statValue}>₹{(reportData.trainer_payouts || 0).toLocaleString()}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Gym Earnings</Text>
                        <Text style={styles.statValue}>₹{(reportData.gym_earnings || 0).toLocaleString()}</Text>
                    </View>
                </View>
            )}

            <TouchableOpacity onPress={() => Alert.alert('Report', 'Exporting...')} style={styles.exportButton}>
                <Text style={styles.exportButtonText}>Export Report</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}>
            <View style={styles.headerSection}>
                <Text style={styles.pageTitle}>Reports & Analytics</Text>
                <Text style={styles.pageSubtitle}>View detailed reports about your business</Text>
            </View>

            <View style={styles.formSection}>
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Select Report Type</Text>

                    <View style={styles.tabsContainer}>
                        {(['overview', 'sessions', 'revenue'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.tabButton, reportType === type && styles.tabButtonActive]}
                                onPress={() => setReportType(type)}
                            >
                                <Text style={[styles.tabButtonText, reportType === type ? styles.tabButtonTextActive : styles.tabButtonTextInactive]}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.listSection}>
                {loading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.red} />
                        <Text style={{ color: colors.lightGray, marginTop: 10 }}>Loading report...</Text>
                    </View>
                ) : (
                    <>
                        {reportType === 'overview' && renderOverviewReport()}
                        {reportType === 'sessions' && renderSessionsReport()}
                        {reportType === 'revenue' && renderRevenueReport()}
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = {
    headerSection: { alignItems: 'center' as const, paddingVertical: 20, paddingHorizontal: 20 },
    pageTitle: { fontSize: 28, fontWeight: '700' as const, color: colors.lightGray, marginBottom: 8, textAlign: 'center' as const },
    pageSubtitle: { fontSize: 16, color: colors.mediumGray, textAlign: 'center' as const, lineHeight: 22 },
    formSection: { paddingHorizontal: 20, marginBottom: 20 },
    formCard: { backgroundColor: colors.darkGray, borderRadius: 16, padding: 20, elevation: 8 },
    formTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.lightGray, marginBottom: 20, textAlign: 'center' as const },
    tabsContainer: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
    tabButton: { flex: 1, backgroundColor: colors.black, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12, marginHorizontal: 5, alignItems: 'center' as const, borderWidth: 1, borderColor: colors.mediumGray },
    tabButtonActive: { backgroundColor: colors.bottleGreen, borderColor: colors.bottleGreen },
    tabButtonText: { fontSize: 14, fontWeight: '600' as const, textAlign: 'center' as const },
    tabButtonTextActive: { color: colors.lightGray },
    tabButtonTextInactive: { color: colors.mediumGray },
    listSection: { paddingHorizontal: 20, paddingBottom: 100 },
    reportCard: { backgroundColor: colors.darkGray, borderRadius: 16, padding: 20, elevation: 8, borderWidth: 1, borderColor: colors.bottleGreen + '30' },
    reportHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20 },
    reportTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.lightGray },
    reportBadge: { backgroundColor: colors.bottleGreen + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    reportBadgeText: { fontSize: 12, fontWeight: '600' as const, color: colors.bottleGreen },
    reportStats: { marginBottom: 20 },
    statItem: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, backgroundColor: colors.black + '40', padding: 12, borderRadius: 8, marginBottom: 8 },
    statLabel: { fontSize: 14, color: colors.mediumGray, flex: 1 },
    statValue: { fontSize: 16, fontWeight: '700' as const, color: colors.bottleGreen },
    exportButton: { backgroundColor: colors.bottleGreen, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center' as const },
    exportButtonText: { color: colors.lightGray, fontSize: 14, fontWeight: '700' as const },
};

export default ReportsScreen;
