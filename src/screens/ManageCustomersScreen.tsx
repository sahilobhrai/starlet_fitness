import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

interface Customer {
    id: string;
    name: string;
    contact: string;
    weight: string; // Storing as string for input flexibility, can be parsed to number
    height: string; // Storing as string for input flexibility, can be parsed to number
    cashAmount: string; // Storing as string for input flexibility
    sessionsAwarded: string; // Storing as string for input flexibility
}

const ManageCustomersScreen = () => {
    const [customers, setCustomers] = useState<Customer[]>([
        { id: '1', name: 'Alice Wonderland', contact: 'alice@example.com', weight: '60', height: '165', cashAmount: '500', sessionsAwarded: '10' },
        { id: '2', name: 'Bob The Builder', contact: 'bob@example.com', weight: '85', height: '180', cashAmount: '1000', sessionsAwarded: '20' },
    ]);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerContact, setNewCustomerContact] = useState('');
    const [newCustomerWeight, setNewCustomerWeight] = useState('');
    const [newCustomerHeight, setNewCustomerHeight] = useState('');
    const [newCustomerCashAmount, setNewCustomerCashAmount] = useState('');
    const [newCustomerSessionsAwarded, setNewCustomerSessionsAwarded] = useState('');
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const handleAddCustomer = () => {
        if (newCustomerName.trim() && newCustomerContact.trim()) { // Basic validation
            const newCustomer: Customer = {
                id: Date.now().toString(),
                name: newCustomerName,
                contact: newCustomerContact,
                weight: newCustomerWeight,
                height: newCustomerHeight,
                cashAmount: newCustomerCashAmount,
                sessionsAwarded: newCustomerSessionsAwarded,
            };
            setCustomers([...customers, newCustomer]);
            // Clear form
            setNewCustomerName('');
            setNewCustomerContact('');
            setNewCustomerWeight('');
            setNewCustomerHeight('');
            setNewCustomerCashAmount('');
            setNewCustomerSessionsAwarded('');
        } else {
            Alert.alert('Please enter at least Name and Contact Info.');
        }
    };

    const handleDeleteCustomer = (id: string) => {
        setCustomers(customers.filter(customer => customer.id !== id));
    };

    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer);
        setNewCustomerName(customer.name);
        setNewCustomerContact(customer.contact);
        setNewCustomerWeight(customer.weight);
        setNewCustomerHeight(customer.height);
        setNewCustomerCashAmount(customer.cashAmount);
        setNewCustomerSessionsAwarded(customer.sessionsAwarded);
    };

    const handleUpdateCustomer = () => {
        if (editingCustomer && newCustomerName.trim() && newCustomerContact.trim()) {
            setCustomers(customers.map(customer =>
                customer.id === editingCustomer.id ? {
                    ...customer,
                    name: newCustomerName,
                    contact: newCustomerContact,
                    weight: newCustomerWeight,
                    height: newCustomerHeight,
                    cashAmount: newCustomerCashAmount,
                    sessionsAwarded: newCustomerSessionsAwarded,
                } : customer
            ));
            // Clear form and reset editing state
            setEditingCustomer(null);
            setNewCustomerName('');
            setNewCustomerContact('');
            setNewCustomerWeight('');
            setNewCustomerHeight('');
            setNewCustomerCashAmount('');
            setNewCustomerSessionsAwarded('');
        } else {
            Alert.alert('Please enter at least Name and Contact Info.');
        }
    };

    const handleCancelEdit = () => {
        setEditingCustomer(null);
        // Clear form
        setNewCustomerName('');
        setNewCustomerContact('');
        setNewCustomerWeight('');
        setNewCustomerHeight('');
        setNewCustomerCashAmount('');
        setNewCustomerSessionsAwarded('');
    };

    const renderCustomerItem = ({ item }: { item: Customer }) => (
        <View style={AppStyles.detailRow}> {/* Replaced styles.customerItem with AppStyles.detailRow */}
            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.customerInfo with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileName}>{item.name}</Text> {/* Replaced styles.customerName with AppStyles.profileName */}
                <Text style={AppStyles.profileDetailText}>Contact: {item.contact}</Text> {/* Replaced styles.customerContact with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailText}>
                    Weight: {item.weight || 'N/A'} | Height: {item.height || 'N/A'}
                </Text> {/* Replaced styles.customerDetails with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailText}>
                    Cash: ${item.cashAmount || '0'} | Sessions: {item.sessionsAwarded || '0'}
                </Text> {/* Replaced styles.customerDetails with AppStyles.profileDetailText */}
            </View>
            <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.customerActions with AppStyles.modalButtonContainer */}
                <TouchableOpacity onPress={() => handleEditCustomer(item)} style={[AppStyles.modalButton, { backgroundColor: '#ffc107', marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.editButton with AppStyles.modalButton and specific color */}
                    <Text style={AppStyles.modalButtonText}>Edit</Text> {/* Replaced styles.buttonText with AppStyles.modalButtonText */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteCustomer(item.id)} style={[AppStyles.modalButton, { backgroundColor: colors.red, marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.deleteButton with AppStyles.modalButton and colors.red */}
                    <Text style={AppStyles.modalButtonText}>Remove</Text> {/* Replaced styles.buttonText with AppStyles.modalButtonText */}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}> {/* Replaced styles.container with AppStyles.mainContent */}
            <Text style={AppStyles.pageTitle}>Manage Customers</Text> {/* Replaced styles.header with AppStyles.pageTitle */}

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.formCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</Text> {/* Replaced styles.formTitle with AppStyles.profileSectionTitle */}
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Customer Name"
                    value={newCustomerName}
                    onChangeText={setNewCustomerName}
                />
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Contact Info (Email/Phone)"
                    value={newCustomerContact}
                    onChangeText={setNewCustomerContact}
                />
                <View style={AppStyles.detailRow}> {/* Replaced styles.row with AppStyles.detailRow */}
                    <TextInput
                        style={[AppStyles.profileInput, { width: '48%', marginRight: '2%' }]} // Replaced styles.input, styles.halfInput with AppStyles.profileInput and inline styles
                        placeholder="Weight (kg)"
                        value={newCustomerWeight}
                        onChangeText={setNewCustomerWeight}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[AppStyles.profileInput, { width: '48%' }]} // Replaced styles.input, styles.halfInput with AppStyles.profileInput and inline styles
                        placeholder="Height (cm)"
                        value={newCustomerHeight}
                        onChangeText={setNewCustomerHeight}
                        keyboardType="numeric"
                    />
                </View>
                <View style={AppStyles.detailRow}> {/* Replaced styles.row with AppStyles.detailRow */}
                    <TextInput
                        style={[AppStyles.profileInput, { width: '48%', marginRight: '2%' }]} // Replaced styles.input, styles.halfInput with AppStyles.profileInput and inline styles
                        placeholder="Cash Amount ($)"
                        value={newCustomerCashAmount}
                        onChangeText={setNewCustomerCashAmount}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[AppStyles.profileInput, { width: '48%' }]} // Replaced styles.input, styles.halfInput with AppStyles.profileInput and inline styles
                        placeholder="Sessions Awarded"
                        value={newCustomerSessionsAwarded}
                        onChangeText={setNewCustomerSessionsAwarded}
                        keyboardType="numeric"
                    />
                </View>

                {editingCustomer ? (
                    <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.formActions with AppStyles.modalButtonContainer */}
                        <TouchableOpacity onPress={handleUpdateCustomer} style={[AppStyles.modalButton, { backgroundColor: '#007bff', marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                            <Text style={AppStyles.modalButtonText}>Update Customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelEdit} style={[AppStyles.modalButton, { backgroundColor: colors.mediumGray, marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                            <Text style={AppStyles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleAddCustomer} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                        <Text style={AppStyles.modalButtonText}>Add Customer</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.listCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>All Customers</Text> {/* Replaced styles.listTitle with AppStyles.profileSectionTitle */}
                <FlatList
                    data={customers}
                    renderItem={renderCustomerItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={AppStyles.modalText}>No customers added yet.</Text>}
                />
            </View>
        </ScrollView>
    );
};

// Removed the local styles object as requested.
// Styles are now imported from AppStyles.

export default ManageCustomersScreen;
