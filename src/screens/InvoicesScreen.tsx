import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Switch, TouchableOpacity, Alert } from 'react-native';

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
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Generate Invoice</Text>

            <View style={styles.formCard}>
                <Text style={styles.formTitle}>Customer Information</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Customer Name"
                    value={invoiceDetails.customerName}
                    onChangeText={(value) => handleInputChange('customerName', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Info (Email/Phone)"
                    value={invoiceDetails.customerContact}
                    onChangeText={(value) => handleInputChange('customerContact', value)}
                />

                <Text style={styles.formTitle}>Invoice Details</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Item Description"
                    value={invoiceDetails.itemDescription}
                    onChangeText={(value) => handleInputChange('itemDescription', value)}
                />
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Quantity"
                        value={invoiceDetails.quantity}
                        onChangeText={(value) => handleInputChange('quantity', value)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Price per Unit ($)"
                        value={invoiceDetails.price}
                        onChangeText={(value) => handleInputChange('price', value)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.gstContainer}>
                    <Text style={styles.gstLabel}>Enable GST</Text>
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
                        style={styles.input}
                        placeholder="GST Rate (%)"
                        value={invoiceDetails.gstRate}
                        onChangeText={(value) => handleInputChange('gstRate', value)}
                        keyboardType="numeric"
                    />
                )}

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
                </View>

                <Button title="Generate Invoice" onPress={generateInvoice} color="#28a745" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f7f6',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#444',
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    halfInput: {
        width: '48%', // Adjust width for two inputs per row
    },
    gstContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    gstLabel: {
        fontSize: 16,
        color: '#444',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

export default InvoicesScreen;
