import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

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
        <View style={styles.customerItem}>
            <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.name}</Text>
                <Text style={styles.customerContact}>Contact: {item.contact}</Text>
                <Text style={styles.customerDetails}>
                    Weight: {item.weight || 'N/A'} | Height: {item.height || 'N/A'}
                </Text>
                <Text style={styles.customerDetails}>
                    Cash: ${item.cashAmount || '0'} | Sessions: {item.sessionsAwarded || '0'}
                </Text>
            </View>
            <View style={styles.customerActions}>
                <TouchableOpacity onPress={() => handleEditCustomer(item)} style={[styles.button, styles.editButton]}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteCustomer(item.id)} style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Manage Customers</Text>

            <View style={styles.formCard}>
                <Text style={styles.formTitle}>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Customer Name"
                    value={newCustomerName}
                    onChangeText={setNewCustomerName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Info (Email/Phone)"
                    value={newCustomerContact}
                    onChangeText={setNewCustomerContact}
                />
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Weight (kg)"
                        value={newCustomerWeight}
                        onChangeText={setNewCustomerWeight}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Height (cm)"
                        value={newCustomerHeight}
                        onChangeText={setNewCustomerHeight}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Cash Amount ($)"
                        value={newCustomerCashAmount}
                        onChangeText={setNewCustomerCashAmount}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Sessions Awarded"
                        value={newCustomerSessionsAwarded}
                        onChangeText={setNewCustomerSessionsAwarded}
                        keyboardType="numeric"
                    />
                </View>

                {editingCustomer ? (
                    <View style={styles.formActions}>
                        <Button title="Update Customer" onPress={handleUpdateCustomer} color="#007bff" />
                        <Button title="Cancel" onPress={handleCancelEdit} color="#6c757d" />
                    </View>
                ) : (
                    <Button title="Add Customer" onPress={handleAddCustomer} color="#28a745" />
                )}
            </View>

            <View style={styles.listCard}>
                <Text style={styles.listTitle}>All Customers</Text>
                <FlatList
                    data={customers}
                    renderItem={renderCustomerItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyListText}>No customers added yet.</Text>}
                />
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
        padding: 15,
        marginBottom: 20,
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
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    listCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#444',
    },
    customerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    customerInfo: {
        flex: 1,
        marginRight: 10,
    },
    customerName: {
        fontSize: 17,
        fontWeight: '500',
        color: '#333',
    },
    customerContact: {
        fontSize: 15,
        color: '#666',
    },
    customerDetails: {
        fontSize: 14,
        color: '#777',
        marginTop: 3,
    },
    customerActions: {
        flexDirection: 'row',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginLeft: 8,
    },
    editButton: {
        backgroundColor: '#ffc107', // Warning color for edit
    },
    deleteButton: {
        backgroundColor: '#dc3545', // Danger color for delete
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyListText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
});

export default ManageCustomersScreen;
