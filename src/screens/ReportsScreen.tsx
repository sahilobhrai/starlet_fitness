import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';

const ReportsScreen = () => {
    const [reportType, setReportType] = useState<'attendance' | 'bookings'>('attendance');

    const renderAttendanceReport = () => (
        <View style={styles.reportContent}>
            <Text style={styles.reportTitle}>Attendance Report</Text>
            <Text style={styles.reportSubtitle}>Period: October 2025</Text>
            {/* Placeholder for attendance data */}
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Trainer A:</Text>
                <Text style={styles.dataValue}>95%</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Trainer B:</Text>
                <Text style={styles.dataValue}>92%</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Customer X:</Text>
                <Text style={styles.dataValue}>98%</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Customer Y:</Text>
                <Text style={styles.dataValue}>90%</Text>
            </View>
            <Button title="Export Attendance Report" onPress={() => Alert.alert('Exporting attendance report...')} color="#007bff" />
        </View>
    );

    const renderBookingsOverview = () => (
        <View style={styles.reportContent}>
            <Text style={styles.reportTitle}>Bookings Overview</Text>
            <Text style={styles.reportSubtitle}>Period: October 2025</Text>
            {/* Placeholder for bookings data */}
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Total Bookings:</Text>
                <Text style={styles.dataValue}>150</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Completed Bookings:</Text>
                <Text style={styles.dataValue}>130</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Cancelled Bookings:</Text>
                <Text style={styles.dataValue}>20</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Peak Booking Day:</Text>
                <Text style={styles.dataValue}>October 15th</Text>
            </View>
            <Button title="Export Bookings Overview" onPress={() => Alert.alert('Exporting bookings overview...')} color="#007bff" />
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Reports</Text>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, reportType === 'attendance' && styles.activeTab]}
                    onPress={() => setReportType('attendance')}
                >
                    <Text style={[styles.tabButtonText, reportType === 'attendance' && styles.activeTabText]}>Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, reportType === 'bookings' && styles.activeTab]}
                    onPress={() => setReportType('bookings')}
                >
                    <Text style={[styles.tabButtonText, reportType === 'bookings' && styles.activeTabText]}>Bookings</Text>
                </TouchableOpacity>
            </View>

            {reportType === 'attendance' ? renderAttendanceReport() : renderBookingsOverview()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f7f6',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
    },
    activeTab: {
        backgroundColor: '#007bff', // Primary color for active tab
    },
    tabButtonText: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    reportContent: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    reportTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#444',
        textAlign: 'center',
    },
    reportSubtitle: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
        textAlign: 'center',
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dataLabel: {
        fontSize: 16,
        color: '#555',
    },
    dataValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

export default ReportsScreen;
