import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Switch, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

// Added navigation prop
const InvoicesScreen = ({ navigation }: { navigation: any }) => {
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
        <View style={styles.container}> {/* Main container for absolute positioning */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.lightGray} />
            </TouchableOpacity>
            <ScrollView style={AppStyles.mainContent}> {/* Content scrollable */}
                <Text style={AppStyles.pageTitle}>Generate Invoice</Text>

                <View style={AppStyles.profileDetailsContainer}>
                    <Text style={AppStyles.profileSectionTitle}>Customer Information</Text>
                    <TextInput
                        style={AppStyles.profileInput}
                        placeholder="Customer Name"
                        value={invoiceDetails.customerName}
                        onChangeText={(value) => handleInputChange('customerName', value)}
                    />
                    <TextInput
                        style={AppStyles.profileInput}
                        placeholder="Contact Info (Email/Phone)"
                        value={invoiceDetails.customerContact}
                        onChangeText={(value) => handleInputChange('customerContact', value)}
                    />

                    <Text style={AppStyles.profileSectionTitle}>Invoice Details</Text>
                    <TextInput
                        style={AppStyles.profileInput}
                        placeholder="Item Description"
                        value={invoiceDetails.itemDescription}
                        onChangeText={(value) => handleInputChange('itemDescription', value)}
                    />
                    <View style={AppStyles.detailRow}>
                        <TextInput
                            style={[AppStyles.profileInput, { width: '48%', marginRight: '2%' }]}
                            placeholder="Quantity"
                            value={invoiceDetails.quantity}
                            onChangeText={(value) => handleInputChange('quantity', value)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={[AppStyles.profileInput, { width: '48%' }]}
                            placeholder="Price per Unit ($)"
                            value={invoiceDetails.price}
                            onChangeText={(value) => handleInputChange('price', value)}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={AppStyles.detailRow}>
                        <Text style={AppStyles.profileDetailText}>Enable GST</Text>
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
                            style={AppStyles.profileInput}
                            placeholder="GST Rate (%)"
                            value={invoiceDetails.gstRate}
                            onChangeText={(value) => handleInputChange('gstRate', value)}
                            keyboardType="numeric"
                        />
                    )}

                    <View style={AppStyles.detailRow}>
                        <Text style={AppStyles.profileDetailBold}>Total Amount:</Text>
                        <Text style={AppStyles.profileDetailBold}>${calculateTotal().toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity onPress={generateInvoice} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5, marginTop: 10 }]}>
                        <Text style={AppStyles.modalButtonText}>Generate Invoice</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

// Define local styles for the back button and container
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black, // Assuming black background from SettingsScreen
    },
    backButton: {
        position: 'absolute',
        top: 20, // Adjust as needed to align with title/header
        left: 20,
        zIndex: 1, // Ensure it's above other content
        padding: 10,
    },
});

export default InvoicesScreen;
