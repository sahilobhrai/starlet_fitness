import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

const HelpScreen = () => {
  return (
    <View style={AppStyles.helpContainer}>
      <Text style={AppStyles.sectionTitle}>HELP & SUPPORT</Text>
      <ScrollView contentContainerStyle={AppStyles.helpContent}>
        <Text style={AppStyles.helpText}>
          Welcome to the Help & Support section. Here you can find answers to common questions and get assistance with using the Starlet Fitness app.
        </Text>
        <Text style={AppStyles.helpSubtitle}>Frequently Asked Questions:</Text>
        <Text style={AppStyles.helpQuestion}>Q: How do I book a training session?</Text>
        <Text style={AppStyles.helpAnswer}>A: Navigate to the 'Book' tab, select your preferred date and time slot, and confirm your booking.</Text>
        <Text style={AppStyles.helpQuestion}>Q: Where can I find nutrition plans?</Text>
        <Text style={AppStyles.helpAnswer}>A: Go to the 'Nutrition' tab to explore various diet plans tailored for different goals.</Text>
        <Text style={AppStyles.helpQuestion}>Q: How can I connect with other users?</Text>
        <Text style={AppStyles.helpAnswer}>A: Visit the 'Community' tab to view posts, challenges, and interact with the Starlet Fitness community.</Text>
        <Text style={AppStyles.helpQuestion}>Q: What if I forget my OTP?</Text>
        <Text style={AppStyles.helpAnswer}>A: On the OTP screen, you can tap 'Resend' to receive a new OTP to your registered mobile number.</Text>
        <Text style={AppStyles.helpSubtitle}>Contact Support:</Text>
        <Text style={AppStyles.helpText}>
          If you need further assistance, please contact our support team at:
        </Text>
        <Text style={AppStyles.contactInfo}>Email: support@starletfitness.com</Text>
        <Text style={AppStyles.contactInfo}>Phone: +1 (555) 123-4567</Text>
        <Text style={AppStyles.contactInfo}>Available: Mon-Fri, 9 AM - 5 PM EST</Text>
      </ScrollView>
    </View>
  );
};

export default HelpScreen;
