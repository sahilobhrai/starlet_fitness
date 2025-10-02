import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Switch, TouchableOpacity, Alert } from 'react-native';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

const InvoicesScreen = () => {
    const [invoiceDetails, setInvoiceDetails] = useState({
        customerName: '',
        customerContact: '',
        itemDescription: '',
        quantity: '1',
        price: '',
        gstEnabled: false,
        gstRate: '18', // Default GST rate
    });

    const handleInputChange = (field: string, value: string) => {
        setInvoiceDetails(prev => ({ ...prev, [field]: value }));
    };

    const toggleGst = (value: boolean) => {
        setInvoiceDetails(prev => ({ ...prev, gstEnabled: value }));
    };

    const calculateTotal = () => {
        const { quantity, price, gstEnabled, gstRate } = invoiceDetails;
        const numQuantity = parseFloat(quantity) || 0;
        const numPrice = parseFloat(price) || 0;
        let subtotal = numQuantity * numPrice;

        if (gstEnabled) {
            const numGstRate = parseFloat(gstRate) || 0;
            const gstAmount = subtotal * (numGstRate / 100);
            return subtotal + gstAmount;
        }
        return subtotal;
    };

    const generateInvoice = () => {
        // Basic validation
        if (!invoiceDetails.customerName || !invoiceDetails.itemDescription || !invoiceDetails.price) {
            Alert.alert('Please fill in all required fields: Customer Name, Item Description, and Price.');
            return;
        }

        const totalAmount = calculateTotal();
        Alert.alert(`Invoice generated for ${invoiceDetails.customerName}:\n` +
            `Item: ${invoiceDetails.itemDescription}\n` +
            `Total: $${totalAmount.toFixed(2)}` +
            `${invoiceDetails.gstEnabled ? ` (incl. ${invoiceDetails.gstRate}% GST)` : ''}`);
        // In a real app, this would involve saving to a database, generating a PDF, etc.
    };

    return (
        <ScrollView style={AppStyles.mainContent}> {/* Replaced styles.container with AppStyles.mainContent */}
            <Text style={AppStyles.pageTitle}>Generate Invoice</Text> {/* Replaced styles.header with AppStyles.pageTitle */}

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.formCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>Customer Information</Text> {/* Replaced styles.formTitle with AppStyles.profileSectionTitle */}
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Customer Name"
                    value={invoiceDetails.customerName}
                    onChangeText={(value) => handleInputChange('customerName', value)}
                />
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Contact Info (Email/Phone)"
                    value={invoiceDetails.customerContact}
                    onChangeText={(value) => handleInputChange('customerContact', value)}
                />

                <Text style={AppStyles.profileSectionTitle}>Invoice Details</Text> {/* Replaced styles.formTitle with AppStyles.profileSectionTitle */}
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Item Description"
                    value={invoiceDetails.itemDescription}
                    onChangeText={(value) => handleInputChange('itemDescription', value)}
                />
                <View style={AppStyles.detailRow}> {/* Replaced styles.row with AppStyles.detailRow */}
                    <TextInput
                        style={[AppStyles.profileInput, { width: '48%', marginRight: '2%' }]} // Replaced styles.input, styles.halfInput with AppStyles.profileInput and inline styles
                        placeholder="Quantity"
                        value={invoiceDetails.quantity}
                        onChangeText={(value) => handleInputChange('quantity', value)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[AppStyles.profileInput, { width: '48%' }]} // Replaced styles.input, styles.halfInput with AppStyles.profileInput and inline styles
                        placeholder="Price per Unit ($)"
                        value={invoiceDetails.price}
                        onChangeText={(value) => handleInputChange('price', value)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={AppStyles.detailRow}> {/* Replaced styles.gstContainer with AppStyles.detailRow */}
                    <Text style={AppStyles.profileDetailText}>Enable GST</Text> {/* Replaced styles.gstLabel with AppStyles.profileDetailText */}
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={invoiceDetails.gstEnabled ? "#007bff" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleGst}
                        value={invoiceDetails.gstEnabled}
                    />
                </View>

                {invoiceDetails.gstEnabled && (
                    <TextInput
                        style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                        placeholder="GST Rate (%)"
                        value={invoiceDetails.gstRate}
                        onChangeText={(value) => handleInputChange('gstRate', value)}
                        keyboardType="numeric"
                    />
                )}

                <View style={AppStyles.detailRow}> {/* Replaced styles.totalSection with AppStyles.detailRow as totalSection is not found in AppStyles */}
                    <Text style={AppStyles.profileDetailBold}>Total Amount:</Text> {/* Replaced styles.totalLabel with AppStyles.profileDetailBold */}
                    <Text style={AppStyles.profileDetailBold}>${calculateTotal().toFixed(2)}</Text> {/* Replaced styles.totalValue with AppStyles.profileDetailBold */}
                </View>

                <TouchableOpacity onPress={generateInvoice} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5, marginTop: 10 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                    <Text style={AppStyles.modalButtonText}>Generate Invoice</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// Removed the local styles object as requested.
// Styles are now imported from AppStyles.

export default InvoicesScreen;
