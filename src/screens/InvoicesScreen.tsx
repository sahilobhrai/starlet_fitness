import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

interface InvoiceDetails {
    customerName: string;
    customerContact: string;
    itemDescription: string;
    quantity: string;
    price: string;
    gstEnabled: boolean;
    gstRate: string;
}

const InvoicesScreen = ({ navigation }: { navigation: any }) => {
    const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
        customerName: '',
        customerContact: '',
        itemDescription: '',
        quantity: '1',
        price: '',
        gstEnabled: false,
        gstRate: '18',
    });

    const handleInputChange = (field: keyof InvoiceDetails, value: string) => {
        setInvoiceDetails(prev => ({ ...prev, [field]: value }));
    };

    const toggleGst = (value: boolean) => {
        setInvoiceDetails(prev => ({ ...prev, gstEnabled: value }));
    };

    const calculateSubtotal = () => {
        const numQuantity = parseFloat(invoiceDetails.quantity) || 0;
        const numPrice = parseFloat(invoiceDetails.price) || 0;
        return numQuantity * numPrice;
    };

    const calculateGstAmount = () => {
        if (!invoiceDetails.gstEnabled) return 0;
        const numGstRate = parseFloat(invoiceDetails.gstRate) || 0;
        return calculateSubtotal() * (numGstRate / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateGstAmount();
    };

    const generateInvoice = () => {
        // Enhanced validation
        if (!invoiceDetails.customerName.trim()) {
            Alert.alert('Validation Error', 'Please enter customer name.');
            return;
        }
        if (!invoiceDetails.customerContact.trim()) {
            Alert.alert('Validation Error', 'Please enter customer contact information.');
            return;
        }
        if (!invoiceDetails.itemDescription.trim()) {
            Alert.alert('Validation Error', 'Please enter item description.');
            return;
        }
        if (!invoiceDetails.price.trim() || parseFloat(invoiceDetails.price) <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
            return;
        }

        const totalAmount = calculateTotal();
        const subtotal = calculateSubtotal();
        const gstAmount = calculateGstAmount();

        Alert.alert(
            'Invoice Generated Successfully! 📄',
            `Customer: ${invoiceDetails.customerName}\n` +
            `Contact: ${invoiceDetails.customerContact}\n` +
            `Item: ${invoiceDetails.itemDescription}\n` +
            `Quantity: ${invoiceDetails.quantity}\n` +
            `Price: $${parseFloat(invoiceDetails.price).toFixed(2)}\n` +
            `Subtotal: $${subtotal.toFixed(2)}\n` +
            `${invoiceDetails.gstEnabled ? `GST (${invoiceDetails.gstRate}%): $${gstAmount.toFixed(2)}\n` : ''}` +
            `Total Amount: $${totalAmount.toFixed(2)}\n\n` +
            '✅ Invoice has been generated and saved to your records.',
            [{ text: 'OK', style: 'default' }]
        );

        // Reset form after successful generation
        setInvoiceDetails({
            customerName: '',
            customerContact: '',
            itemDescription: '',
            quantity: '1',
            price: '',
            gstEnabled: false,
            gstRate: '18',
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.lightGray} />
            </TouchableOpacity>
            <ScrollView style={AppStyles.mainContent}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.pageTitle}>Generate Invoice</Text>
                    <Text style={styles.pageSubtitle}>Create professional invoices for your fitness services</Text>
                </View>

                {/* Customer Information Section */}
                <View style={styles.formSection}>
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>👤 Customer Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Customer Name *</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter customer full name"
                                placeholderTextColor={colors.mediumGray}
                                value={invoiceDetails.customerName}
                                onChangeText={(value) => handleInputChange('customerName', value)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Contact Information *</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="Email address or phone number"
                                placeholderTextColor={colors.mediumGray}
                                value={invoiceDetails.customerContact}
                                onChangeText={(value) => handleInputChange('customerContact', value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                </View>

                {/* Service Details Section */}
                <View style={styles.formSection}>
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>🏋️ Service Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Service Description *</Text>
                            <TextInput
                                style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                                placeholder="Describe the fitness service provided..."
                                placeholderTextColor={colors.mediumGray}
                                value={invoiceDetails.itemDescription}
                                onChangeText={(value) => handleInputChange('itemDescription', value)}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.inputLabel}>Quantity</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="1"
                                    placeholderTextColor={colors.mediumGray}
                                    value={invoiceDetails.quantity}
                                    onChangeText={(value) => handleInputChange('quantity', value)}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                <Text style={styles.inputLabel}>Price per Unit ($) *</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.mediumGray}
                                    value={invoiceDetails.price}
                                    onChangeText={(value) => handleInputChange('price', value)}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* GST Section */}
                <View style={styles.formSection}>
                    <View style={styles.formCard}>
                        <View style={styles.gstToggleContainer}>
                            <View style={styles.gstToggleLeft}>
                                <Text style={styles.inputLabel}>Apply GST</Text>
                                <Text style={styles.gstToggleSubtext}>Add Goods & Services Tax</Text>
                            </View>
                            <Switch
                                trackColor={{ false: colors.mediumGray, true: colors.bottleGreen + '60' }}
                                thumbColor={invoiceDetails.gstEnabled ? colors.bottleGreen : colors.lightGray}
                                ios_backgroundColor={colors.darkGray}
                                onValueChange={toggleGst}
                                value={invoiceDetails.gstEnabled}
                            />
                        </View>

                        {invoiceDetails.gstEnabled && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>GST Rate (%)</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="18"
                                    placeholderTextColor={colors.mediumGray}
                                    value={invoiceDetails.gstRate}
                                    onChangeText={(value) => handleInputChange('gstRate', value)}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        )}
                    </View>
                </View>

                {/* Invoice Summary Section */}
                <View style={styles.formSection}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.formTitle}>📊 Invoice Summary</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal:</Text>
                            <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
                        </View>

                        {invoiceDetails.gstEnabled && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>GST ({invoiceDetails.gstRate}%):</Text>
                                <Text style={styles.summaryValue}>${calculateGstAmount().toFixed(2)}</Text>
                            </View>
                        )}

                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total Amount:</Text>
                            <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Generate Button */}
                <View style={styles.formSection}>
                    <TouchableOpacity
                        onPress={generateInvoice}
                        style={[
                            styles.generateButton,
                            (!invoiceDetails.customerName.trim() ||
                                !invoiceDetails.customerContact.trim() ||
                                !invoiceDetails.itemDescription.trim() ||
                                !invoiceDetails.price.trim() ||
                                parseFloat(invoiceDetails.price) <= 0) && styles.generateButtonDisabled
                        ]}
                        disabled={!invoiceDetails.customerName.trim() ||
                            !invoiceDetails.customerContact.trim() ||
                            !invoiceDetails.itemDescription.trim() ||
                            !invoiceDetails.price.trim() ||
                            parseFloat(invoiceDetails.price) <= 0}
                    >
                        <Text style={styles.generateButtonText}>📄 Generate Invoice</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

// Define comprehensive styles matching ManageBranchesScreen pattern
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

    // Form Sections
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

    // Input Groups
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.lightGray,
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: colors.black,
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.lightGray,
    },

    // Input Row for Quantity and Price
    inputRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
    },

    // GST Toggle
    gstToggleContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 20,
        paddingVertical: 10,
    },
    gstToggleLeft: {
        flex: 1,
    },
    gstToggleSubtext: {
        fontSize: 12,
        color: colors.mediumGray,
        marginTop: 2,
    },

    // Summary Section
    summaryCard: {
        backgroundColor: colors.darkGray,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: colors.bottleGreen + '40',
    },
    summaryRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 16,
        color: colors.mediumGray,
    },
    summaryValue: {
        fontSize: 16,
        color: colors.lightGray,
        fontWeight: '600' as const,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: colors.mediumGray + '40',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        color: colors.lightGray,
        fontWeight: '700' as const,
    },
    totalValue: {
        fontSize: 18,
        color: colors.bottleGreen,
        fontWeight: '700' as const,
    },

    // Generate Button
    generateButton: {
        backgroundColor: colors.bottleGreen,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center' as const,
        shadowColor: colors.bottleGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    generateButtonDisabled: {
        backgroundColor: colors.mediumGray,
        shadowOpacity: 0.1,
    },
    generateButtonText: {
        color: colors.lightGray,
        fontSize: 18,
        fontWeight: '700' as const,
        letterSpacing: 0.5,
    },
});

export default InvoicesScreen;
