import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';

const PrivacyPolicyScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.lightGray} />
            </TouchableOpacity>
            <Text style={styles.title}>Privacy Policy</Text>
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.text}>
                    This Privacy Policy describes how Starlet Fitness ("we", "us", or "our") collects, uses, and discloses your information when you use our mobile application (the "Service").
                </Text>

                <Text style={styles.sectionTitle}>2. Information We Collect</Text>
                <Text style={styles.text}>
                    We may collect personal information that you provide to us, such as your name, email address, phone number, and fitness-related data. We also collect non-personal information automatically, such as device type, operating system, and usage data.
                </Text>

                <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
                <Text style={styles.text}>
                    We use your information to provide and improve the Service, personalize your experience, communicate with you, and for marketing purposes.
                </Text>

                <Text style={styles.sectionTitle}>4. Data Security</Text>
                <Text style={styles.text}>
                    We take reasonable measures to protect your information, but no method of transmission over the internet or electronic storage is 100% secure.
                </Text>

                <Text style={styles.sectionTitle}>5. Your Choices</Text>
                <Text style={styles.text}>
                    You can choose not to provide certain information, but this may limit your ability to use certain features of the Service.
                </Text>

                <Text style={styles.sectionTitle}>6. Changes to This Privacy Policy</Text>
                <Text style={styles.text}>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </Text>

                <Text style={styles.sectionTitle}>7. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions about this Privacy Policy, please contact us at support@starletfitness.com.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.lightGray,
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.lightGray,
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: colors.mediumGray,
        lineHeight: 24,
        marginBottom: 15,
    },
});

export default PrivacyPolicyScreen;
