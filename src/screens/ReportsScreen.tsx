import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

const ReportsScreen = ({ navigation }: { navigation: any }) => {
    const [reportType, setReportType] = useState<'attendance' | 'bookings'>('attendance');

    const renderAttendanceReport = () => (
        <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.reportContent with AppStyles.profileDetailsContainer */}
            <Text style={AppStyles.profileSectionTitle}>Attendance Report</Text> {/* Replaced styles.reportTitle with AppStyles.profileSectionTitle */}
            <Text style={AppStyles.profileDetailText}>Period: October 2025</Text> {/* Replaced styles.reportSubtitle with AppStyles.profileDetailText */}
            {/* Placeholder for attendance data */}
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Trainer A:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>95%</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Trainer B:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>92%</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Customer X:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>98%</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Customer Y:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>90%</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Exporting attendance report...')} style={[AppStyles.modalButton, { backgroundColor: colors.primary, marginHorizontal: 5, marginTop: 10 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                <Text style={AppStyles.modalButtonText}>Export Attendance Report</Text>
            </TouchableOpacity>
        </View>
    );

    const renderBookingsOverview = () => (
        <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.reportContent with AppStyles.profileDetailsContainer */}
            <Text style={AppStyles.profileSectionTitle}>Bookings Overview</Text> {/* Replaced styles.reportTitle with AppStyles.profileSectionTitle */}
            <Text style={AppStyles.profileDetailText}>Period: October 2025</Text> {/* Replaced styles.reportSubtitle with AppStyles.profileDetailText */}
            {/* Placeholder for bookings data */}
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Total Bookings:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>150</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Completed Bookings:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>130</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Cancelled Bookings:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>20</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <View style={AppStyles.detailRow}> {/* Replaced styles.dataRow with AppStyles.detailRow */}
                <Text style={AppStyles.profileDetailText}>Peak Booking Day:</Text> {/* Replaced styles.dataLabel with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailBold}>October 15th</Text> {/* Replaced styles.dataValue with AppStyles.profileDetailBold */}
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Exporting bookings overview...')} style={[AppStyles.modalButton, { backgroundColor: colors.primary, marginHorizontal: 5, marginTop: 10 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                <Text style={AppStyles.modalButtonText}>Export Bookings Overview</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}> {/* Replaced styles.container with AppStyles.mainContent */}
            <Text style={AppStyles.pageTitle}>Reports</Text> {/* Replaced styles.header with AppStyles.pageTitle */}

            <View style={[AppStyles.modalButtonContainer, { marginHorizontal: 0, marginTop: 0, marginBottom: 20, borderRadius: 8, overflow: 'hidden' }]}> {/* Replaced styles.tabsContainer with AppStyles.modalButtonContainer and inline styles */}
                <TouchableOpacity
                    style={[AppStyles.modalButton, { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: reportType === 'attendance' ? colors.darkGray : colors.lightGray }]} // Using AppStyles.modalButton and conditional background
                    onPress={() => setReportType('attendance')}
                >
                    <Text style={[AppStyles.modalButtonText, { color: reportType === 'attendance' ? colors.lightGray : colors.darkGray }]}>Attendance</Text> {/* Using AppStyles.modalButtonText and conditional text color */}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[AppStyles.modalButton, { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: reportType === 'bookings' ? colors.darkGray : colors.lightGray }]} // Using AppStyles.modalButton and conditional background
                    onPress={() => setReportType('bookings')}
                >
                    <Text style={[AppStyles.modalButtonText, { color: reportType === 'bookings' ? colors.lightGray : colors.darkGray }]}>Bookings</Text> {/* Using AppStyles.modalButtonText and conditional text color */}
                </TouchableOpacity>
            </View>

            {reportType === 'attendance' ? renderAttendanceReport() : renderBookingsOverview()}
        </ScrollView>
    );
};

// Removed the local styles object as requested.
// Styles are now imported from AppStyles.

export default ReportsScreen;
