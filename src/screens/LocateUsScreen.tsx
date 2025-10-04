import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';

const LocateUsScreen = ({ navigation }: { navigation: any }) => {
  const gymLocation = {
    latitude: 34.052235, // Example: Los Angeles
    longitude: -118.243683,
    label: 'Starlet Fitness Main Branch',
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${gymLocation.latitude},${gymLocation.longitude}&query_place_id=${gymLocation.label}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const contactSupport = () => {
    const phoneNumber = '+15551234567';
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => console.error('An error occurred calling support', err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.lightGray} />
      </TouchableOpacity>
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>📍 Locate Us</Text>
          <Text style={styles.pageSubtitle}>Find our fitness centers and connect with us</Text>
        </View>

        {/* Main Branch Location Card */}
        <View style={styles.locationSection}>
          <View style={styles.locationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.locationIcon}>
                <Icon name="map-marker" size={32} color={colors.bottleGreen} />
              </View>
              <View style={styles.locationHeader}>
                <Text style={styles.locationTitle}>🏢 Main Branch</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>ACTIVE</Text>
                </View>
              </View>
            </View>

            <View style={styles.locationDetails}>
              <View style={styles.detailItem}>
                <Icon name="map-marker" size={20} color={colors.bottleGreen} />
                <Text style={styles.detailText}>123 Fitness Avenue, Health City, HC 12345</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="phone" size={20} color={colors.bottleGreen} />
                <Text style={styles.detailText}>+1 (555) 123-4567</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="envelope" size={20} color={colors.bottleGreen} />
                <Text style={styles.detailText}>info@starletfitness.com</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="clock-o" size={20} color={colors.bottleGreen} />
                <Text style={styles.detailText}>Mon-Fri: 6AM-10PM | Sat-Sun: 7AM-8PM</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={openGoogleMaps}>
              <Icon name="map" size={20} color={colors.lightGray} />
              <Text style={styles.primaryButtonText}>🗺️ Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Branch Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>✨ Branch Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Icon name="wifi" size={24} color={colors.bottleGreen} />
              <Text style={styles.featureText}>Free WiFi</Text>
            </View>
            <View style={styles.featureCard}>
              <Icon name="car" size={24} color={colors.bottleGreen} />
              <Text style={styles.featureText}>Parking Available</Text>
            </View>
            <View style={styles.featureCard}>
              <Icon name="tint" size={24} color={colors.bottleGreen} />
              <Text style={styles.featureText}>Showers & Locker</Text>
            </View>
            <View style={styles.featureCard}>
              <Icon name="cutlery" size={24} color={colors.bottleGreen} />
              <Text style={styles.featureText}>Healthy Cafe</Text>
            </View>
          </View>
        </View>

        {/* Social Media Section */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>🌐 Connect With Us</Text>
          <View style={styles.socialCard}>
            <Text style={styles.socialTitle}>Follow us on social media for updates, tips, and community highlights!</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://facebook.com/starletfitness')}>
                <Icon name="facebook-square" size={28} color="#1877F2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://instagram.com/starletfitness')}>
                <Icon name="instagram" size={28} color="#E4405F" />
                <Text style={styles.socialButtonText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://twitter.com/starletfitness')}>
                <Icon name="twitter" size={28} color="#1DA1F2" />
                <Text style={styles.socialButtonText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://youtube.com/starletfitness')}>
                <Icon name="youtube-play" size={28} color="#FF0000" />
                <Text style={styles.socialButtonText}>YouTube</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.supportSection}>
          <View style={styles.supportCard}>
            <Icon name="headphones" size={40} color={colors.bottleGreen} />
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportText}>Our support team is here to assist you with any questions or concerns.</Text>
            <TouchableOpacity style={styles.supportButton} onPress={contactSupport}>
              <Icon name="phone" size={16} color={colors.lightGray} />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Comprehensive styles for modern Locate Us design
const styles = StyleSheet.create({
  // Container and Navigation
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.black,
  },

  // Header Section
  headerSection: {
    alignItems: 'center' as const,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 60,
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

  // Scroll Content
  scrollContent: {
    paddingBottom: 100,
  },

  // Location Section
  locationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
  },
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  locationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.bottleGreen + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 15,
  },
  locationHeader: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: colors.bottleGreen + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
  },
  statusBadgeText: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: 'bold',
  },

  // Location Details
  locationDetails: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.black + '40',
    borderRadius: 8,
  },
  detailText: {
    fontSize: 16,
    color: colors.lightGray,
    marginLeft: 12,
    flex: 1,
  },

  // Primary Button
  primaryButton: {
    backgroundColor: colors.bottleGreen,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 10,
  },
  primaryButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: '700' as const,
    marginLeft: 8,
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  featuresGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.darkGray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center' as const,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.lightGray,
    marginTop: 8,
    textAlign: 'center' as const,
  },

  // Social Media Section
  socialSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  socialCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialTitle: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    marginBottom: 20,
    lineHeight: 22,
  },
  socialLinks: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-around' as const,
  },
  socialButton: {
    alignItems: 'center' as const,
    padding: 15,
    margin: 5,
    borderRadius: 12,
    backgroundColor: colors.black + '40',
    minWidth: 80,
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.lightGray,
    marginTop: 6,
    textAlign: 'center' as const,
  },

  // Support Section
  supportSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  supportCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginTop: 15,
    marginBottom: 10,
  },
  supportText: {
    fontSize: 14,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    marginBottom: 20,
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: colors.bottleGreen,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  supportButtonText: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 8,
  },

  // Legacy styles (keeping for backward compatibility)
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.lightGray,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 10,
  },
  mapButton: {
    backgroundColor: '#ff0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  mapButtonIcon: {
    marginRight: 10,
  },
  mapButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default LocateUsScreen;
