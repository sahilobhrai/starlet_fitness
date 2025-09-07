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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.lightGray} />
      </TouchableOpacity>
      <Text style={styles.title}>Locate Us</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Our Main Branch</Text>
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={20} color={colors.lightGray} style={styles.detailIcon} />
            <Text style={styles.detailText}>123 Fitness Avenue, Health City, HC 12345</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="phone" size={20} color={colors.lightGray} style={styles.detailIcon} />
            <Text style={styles.detailText}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="envelope" size={20} color={colors.lightGray} style={styles.detailIcon} />
            <Text style={styles.detailText}>info@starletfitness.com</Text>
          </View>
          <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
            <Icon name="google" size={20} color={colors.black} style={styles.mapButtonIcon} />
            <Text style={styles.mapButtonText}>Open in Google Maps</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Follow Us</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/starletfitness')}>
              <Icon name="facebook-square" size={30} color={colors.lightGray} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/starletfitness')}>
              <Icon name="instagram" size={30} color={colors.lightGray} style={styles.socialIcon} />
            </TouchableOpacity>

          </View>
        </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  detailText: {
    fontSize: 16,
    color: colors.lightGray,
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
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default LocateUsScreen;
