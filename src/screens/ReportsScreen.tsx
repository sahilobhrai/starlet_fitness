import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

const ReportsScreen = ({ navigation }: { navigation: any }) => {
    const [reportType, setReportType] = useState<'attendance' | 'bookings'>('attendance');

    const renderAttendanceReport = () => (
        <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>📋 Attendance Report</Text>
                <View style={styles.reportBadge}>
                    <Text style={styles.reportBadgeText}>October 2025</Text>
                </View>
            </View>

            <View style={styles.reportStats}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>👨‍💼 Trainer A</Text>
                    <Text style={styles.statValue}>95%</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>👩‍💼 Trainer B</Text>
                    <Text style={styles.statValue}>92%</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>🏋️ Customer X</Text>
                    <Text style={styles.statValue}>98%</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>🏃 Customer Y</Text>
                    <Text style={styles.statValue}>90%</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => Alert.alert('Exporting attendance report...')}
                style={styles.exportButton}
            >
                <Text style={styles.exportButtonText}>📥 Export Report</Text>
            </TouchableOpacity>
        </View>
    );

    const renderBookingsOverview = () => (
        <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>📅 Bookings Overview</Text>
                <View style={styles.reportBadge}>
                    <Text style={styles.reportBadgeText}>October 2025</Text>
                </View>
            </View>

            <View style={styles.reportStats}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>📊 Total Bookings</Text>
                    <Text style={styles.statValue}>150</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>✅ Completed Bookings</Text>
                    <Text style={styles.statValue}>130</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>❌ Cancelled Bookings</Text>
                    <Text style={styles.statValue}>20</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>📈 Peak Booking Day</Text>
                    <Text style={styles.statValue}>Oct 15th</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => Alert.alert('Exporting bookings overview...')}
                style={styles.exportButton}
            >
                <Text style={styles.exportButtonText}>📥 Export Report</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.pageTitle}>Reports & Analytics</Text>
                <Text style={styles.pageSubtitle}>View detailed reports and insights about your fitness business</Text>
            </View>

            {/* Report Type Selection */}
            <View style={styles.formSection}>
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>📊 Select Report Type</Text>

                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                reportType === 'attendance' && styles.tabButtonActive
                            ]}
                            onPress={() => setReportType('attendance')}
                        >
                            <Text style={[
                                styles.tabButtonText,
                                reportType === 'attendance' ? styles.tabButtonTextActive : styles.tabButtonTextInactive
                            ]}>
                                📋 Attendance Report
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                reportType === 'bookings' && styles.tabButtonActive
                            ]}
                            onPress={() => setReportType('bookings')}
                        >
                            <Text style={[
                                styles.tabButtonText,
                                reportType === 'bookings' ? styles.tabButtonTextActive : styles.tabButtonTextInactive
                            ]}>
                                📅 Bookings Overview
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Report Content Section */}
            <View style={styles.listSection}>
                {reportType === 'attendance' ? renderAttendanceReport() : renderBookingsOverview()}
            </View>
        </ScrollView>
    );
};

const styles = {
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

    // Form Section
    formSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    formCard: {
        backgroundColor: colors.darkGray,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: colors.lightGray,
        marginBottom: 20,
        textAlign: 'center' as const,
    },
    tabsContainer: {
        marginTop: 10,
    },
    tabButton: {
        backgroundColor: colors.black,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center' as const,
        borderWidth: 1,
        borderColor: colors.mediumGray,
    },
    tabButtonActive: {
        backgroundColor: colors.bottleGreen,
        borderColor: colors.bottleGreen,
    },
    tabButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
    },
    tabButtonTextActive: {
        color: colors.lightGray,
    },
    tabButtonTextInactive: {
        color: colors.mediumGray,
    },

    // List Section
    listSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    // Report Card Styles
    reportCard: {
        backgroundColor: colors.darkGray,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: colors.bottleGreen + '30',
    },
    reportHeader: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 20,
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: colors.lightGray,
    },
    reportBadge: {
        backgroundColor: colors.bottleGreen + '20',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    reportBadgeText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.bottleGreen,
    },
    reportStats: {
        marginBottom: 20,
    },
    statItem: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        backgroundColor: colors.black + '40',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 14,
        color: colors.mediumGray,
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.bottleGreen,
    },
    exportButton: {
        backgroundColor: colors.bottleGreen,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center' as const,
    },
    exportButtonText: {
        color: colors.lightGray,
        fontSize: 14,
        fontWeight: '700' as const,
    },
};

export default ReportsScreen;
