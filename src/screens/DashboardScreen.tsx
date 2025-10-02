import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DashboardScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Dashboard</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Key Metrics</Text>
                <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Total Users:</Text>
                    <Text style={styles.metricValue}>1200</Text>
                </View>
                <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Active Sessions:</Text>
                    <Text style={styles.metricValue}>50</Text>
                </View>
                <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Bookings Today:</Text>
                    <Text style={styles.metricValue}>15</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Recent Activities</Text>
                <Text style={styles.activityItem}>- New customer registered: John Doe</Text>
                <Text style={styles.activityItem}>- Trainer 'Alice' updated schedule</Text>
                <Text style={styles.activityItem}>- Invoice #12345 generated</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Announcements</Text>
                <Text style={styles.activityItem}>- Upcoming maintenance on Sunday.</Text>
                <Text style={styles.activityItem}>- New feature: Session booking confirmation.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f7f6', // A light background color
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // for Android shadow
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#444',
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    metricLabel: {
        fontSize: 16,
        color: '#555',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff', // A primary color, assuming this is a common theme color
    },
    activityItem: {
        fontSize: 15,
        color: '#666',
        marginBottom: 8,
        lineHeight: 22,
    },
});

export default DashboardScreen;
