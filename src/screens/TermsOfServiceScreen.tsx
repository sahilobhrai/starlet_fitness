import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';

const TermsOfServiceScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.lightGray} />
            </TouchableOpacity>
            <Text style={styles.title}>Terms of Service</Text>
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.text}>
                    By accessing or using the Starlet Fitness mobile application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                </Text>

                <Text style={styles.sectionTitle}>2. Use of the Service</Text>
                <Text style={styles.text}>
                    You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for your own conduct and any data that you generate and share in the Service.
                </Text>

                <Text style={styles.sectionTitle}>3. Intellectual Property</Text>
                <Text style={styles.text}>
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Starlet Fitness and its licensors.
                </Text>

                <Text style={styles.sectionTitle}>4. Termination</Text>
                <Text style={styles.text}>
                    We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </Text>

                <Text style={styles.sectionTitle}>5. Governing Law</Text>
                <Text style={styles.text}>
                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </Text>

                <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
                <Text style={styles.text}>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                </Text>

                <Text style={styles.sectionTitle}>7. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions about these Terms, please contact us at support@starletfitness.com.
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

export default TermsOfServiceScreen;
