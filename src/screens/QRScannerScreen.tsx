import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { scanSessionQR } from '../api';

interface QRScannerScreenProps {
  navigation: any;
}

type BannerState = {
  type: 'success' | 'error';
  message: string;
} | null;

const RESCAN_COOLDOWN_MS = 3000;

const QRScannerScreen = ({ navigation }: QRScannerScreenProps) => {
  const [processing, setProcessing] = useState(false);
  const [banner, setBanner] = useState<BannerState>(null);
  const lastCodeRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  const handleReadCode = async (event: { nativeEvent: { codeStringValue: string } }) => {
    const token = event.nativeEvent.codeStringValue;
    const now = Date.now();

    if (processing) return;
    if (token === lastCodeRef.current && now - lastScanTimeRef.current < RESCAN_COOLDOWN_MS) {
      return;
    }

    lastCodeRef.current = token;
    lastScanTimeRef.current = now;
    setProcessing(true);
    setBanner(null);

    try {
      const trainerId = await AsyncStorage.getItem('userId');
      if (!trainerId) {
        setBanner({ type: 'error', message: 'Could not identify trainer. Please log in again.' });
        return;
      }

      const response = await scanSessionQR(token, trainerId);
      if (response.code === '100' && response.session) {
        const customerName = response.session.customer_name || 'Client';
        const time = response.session.session_date
          ? new Date(response.session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';
        setBanner({
          type: 'success',
          message: response.newly_checked_in
            ? `Checked in: ${customerName}${time ? ` (${time})` : ''}`
            : `${customerName} is already checked in`,
        });
      } else {
        setBanner({ type: 'error', message: response.error || 'Could not check in this QR code' });
      }
    } catch (error) {
      console.error('Error scanning session QR:', error);
      setBanner({ type: 'error', message: 'Failed to scan QR code. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={colors.lightGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Session QR</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          scanBarcode
          onReadCode={handleReadCode}
          showFrame
          laserColor={colors.bottleGreen}
          frameColor={colors.lightGreen}
        />

        {processing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.lightGray} />
          </View>
        )}
      </View>

      <Text style={styles.instructions}>
        Point the camera at the client's session QR code. You can keep scanning to check in multiple clients.
      </Text>

      {banner && (
        <View style={[styles.banner, banner.type === 'success' ? styles.bannerSuccess : styles.bannerError]}>
          <Icon
            name={banner.type === 'success' ? 'check-circle' : 'exclamation-circle'}
            size={20}
            color={colors.white}
          />
          <Text style={styles.bannerText}>{banner.message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.lightGray, fontSize: 18, fontWeight: '700' },
  cameraContainer: { flex: 1, marginHorizontal: 15, borderRadius: 16, overflow: 'hidden' },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    color: colors.mediumGray,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  bannerSuccess: { backgroundColor: colors.bottleGreen },
  bannerError: { backgroundColor: colors.red },
  bannerText: { color: colors.white, fontSize: 14, fontWeight: '600', marginLeft: 10, flex: 1 },
});

export default QRScannerScreen;
