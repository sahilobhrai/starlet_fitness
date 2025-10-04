import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
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

const ManageCustomersScreen = ({ navigation }: { navigation: any }) => {
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
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!newCustomerName.trim()) {
            errors.name = 'Customer name is required';
        }

        if (!newCustomerContact.trim()) {
            errors.contact = 'Contact information is required';
        } else if (!/\S+@\S+\.\S+/.test(newCustomerContact) && !/^\+?[\d\s-()]{10,}$/.test(newCustomerContact)) {
            errors.contact = 'Please enter a valid email or phone number';
        }

        if (newCustomerWeight && (isNaN(Number(newCustomerWeight)) || Number(newCustomerWeight) <= 0)) {
            errors.weight = 'Please enter a valid weight in kg';
        }

        if (newCustomerHeight && (isNaN(Number(newCustomerHeight)) || Number(newCustomerHeight) <= 0)) {
            errors.height = 'Please enter a valid height in cm';
        }

        if (newCustomerCashAmount && (isNaN(Number(newCustomerCashAmount)) || Number(newCustomerCashAmount) < 0)) {
            errors.cashAmount = 'Please enter a valid cash amount';
        }

        if (newCustomerSessionsAwarded && (isNaN(Number(newCustomerSessionsAwarded)) || Number(newCustomerSessionsAwarded) < 0)) {
            errors.sessionsAwarded = 'Please enter a valid number of sessions';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCustomer = () => {
        if (validateForm()) {
            setIsLoading(true);
            const newCustomer: Customer = {
                id: Date.now().toString(),
                name: newCustomerName.trim(),
                contact: newCustomerContact.trim(),
                weight: newCustomerWeight,
                height: newCustomerHeight,
                cashAmount: newCustomerCashAmount,
                sessionsAwarded: newCustomerSessionsAwarded,
            };

            // Simulate async operation for better UX
            setTimeout(() => {
                setCustomers([...customers, newCustomer]);
                // Clear form
                setNewCustomerName('');
                setNewCustomerContact('');
                setNewCustomerWeight('');
                setNewCustomerHeight('');
                setNewCustomerCashAmount('');
                setNewCustomerSessionsAwarded('');
                setFormErrors({});
                setIsLoading(false);
                Alert.alert('Success', 'Customer added successfully!');
            }, 500);
        }
    };

    const handleDeleteCustomer = (id: string) => {
        Alert.alert(
            'Delete Customer',
            'Are you sure you want to delete this customer? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setCustomers(customers.filter(customer => customer.id !== id));
                        Alert.alert('Success', 'Customer deleted successfully!');
                    }
                }
            ]
        );
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
        if (validateForm() && editingCustomer) {
            setIsLoading(true);
            // Simulate async operation for better UX
            setTimeout(() => {
                setCustomers(customers.map(customer =>
                    customer.id === editingCustomer.id ? {
                        ...customer,
                        name: newCustomerName.trim(),
                        contact: newCustomerContact.trim(),
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
                setFormErrors({});
                setIsLoading(false);
                Alert.alert('Success', 'Customer updated successfully!');
            }, 500);
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
        <View style={{
            backgroundColor: colors.darkGray,
            borderRadius: 12,
            marginBottom: 15,
            padding: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderWidth: 1,
            borderColor: colors.mediumGray + '20',
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 10,
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colors.lightGray,
                        marginBottom: 8,
                    }}>{item.name}</Text>
                    <View style={{
                        backgroundColor: colors.bottleGreen + '20',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        alignSelf: 'flex-start',
                        marginBottom: 8,
                    }}>
                        <Text style={{
                            fontSize: 12,
                            color: colors.bottleGreen,
                            fontWeight: 'bold',
                        }}>ACTIVE CUSTOMER</Text>
                    </View>
                </View>
                <View style={{
                    backgroundColor: colors.lightGray + '10',
                    borderRadius: 8,
                    padding: 8,
                }}>
                    <Text style={{
                        fontSize: 12,
                        color: colors.lightGray,
                        fontWeight: 'bold',
                    }}>ID: {item.id}</Text>
                </View>
            </View>

            <View style={{
                backgroundColor: colors.black + '40',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
            }}>
                <Text style={{
                    fontSize: 16,
                    color: colors.lightGray,
                    marginBottom: 6,
                    fontWeight: '600',
                }}>📧 Contact Information</Text>
                <Text style={{
                    fontSize: 14,
                    color: colors.mediumGray,
                }}>{item.contact}</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
            }}>
                <View style={{
                    flex: 1,
                    marginRight: 8,
                    backgroundColor: colors.black + '40',
                    borderRadius: 8,
                    padding: 10,
                }}>
                    <Text style={{
                        fontSize: 12,
                        color: colors.mediumGray,
                        marginBottom: 4,
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                    }}>Physical Stats</Text>
                    <Text style={{
                        fontSize: 14,
                        color: colors.lightGray,
                        fontWeight: '600',
                    }}>
                        ⚖️ {item.weight || 'N/A'} kg | 📏 {item.height || 'N/A'} cm
                    </Text>
                </View>

                <View style={{
                    flex: 1,
                    marginLeft: 8,
                    backgroundColor: colors.black + '40',
                    borderRadius: 8,
                    padding: 10,
                }}>
                    <Text style={{
                        fontSize: 12,
                        color: colors.mediumGray,
                        marginBottom: 4,
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                    }}>Account Balance</Text>
                    <Text style={{
                        fontSize: 14,
                        color: colors.bottleGreen,
                        fontWeight: 'bold',
                    }}>
                        💰 ${item.cashAmount || '0'}
                    </Text>
                </View>
            </View>

            <View style={{
                backgroundColor: colors.bottleGreen + '20',
                borderRadius: 8,
                padding: 10,
                marginBottom: 12,
            }}>
                <Text style={{
                    fontSize: 12,
                    color: colors.bottleGreen,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                }}>Session Package</Text>
                <Text style={{
                    fontSize: 16,
                    color: colors.bottleGreen,
                    fontWeight: 'bold',
                }}>
                    🎯 {item.sessionsAwarded || '0'} Sessions Remaining
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: colors.mediumGray + '30',
                paddingTop: 12,
            }}>
                <TouchableOpacity
                    onPress={() => handleEditCustomer(item)}
                    style={{
                        backgroundColor: '#ffc107',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        flex: 1,
                        marginRight: 8,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{
                        color: colors.black,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteCustomer(item.id)}
                    style={{
                        backgroundColor: colors.red,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        flex: 1,
                        marginLeft: 8,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{
                        color: colors.lightGray,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>🗑️ Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Calculate customer statistics
    const totalCustomers = customers.length;
    const totalCashAmount = customers.reduce((sum, customer) => sum + (Number(customer.cashAmount) || 0), 0);
    const totalSessionsAwarded = customers.reduce((sum, customer) => sum + (Number(customer.sessionsAwarded) || 0), 0);

    return (
        <ScrollView style={AppStyles.mainContent}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.pageTitle}>Manage Customers</Text>
                <Text style={styles.pageSubtitle}>Add, edit, and manage your fitness customers</Text>
            </View>

            {/* Add/Edit Form Section */}
            <View style={styles.formSection}>
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>
                        {editingCustomer ? '✏️ Edit Customer' : '➕ Add New Customer'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={[
                                styles.formInput,
                                formErrors.name && { borderColor: colors.red }
                            ]}
                            placeholder="Enter customer's full name"
                            placeholderTextColor={colors.mediumGray}
                            value={newCustomerName}
                            onChangeText={(text) => {
                                setNewCustomerName(text);
                                if (formErrors.name) {
                                    setFormErrors({ ...formErrors, name: '' });
                                }
                            }}
                        />
                        {formErrors.name ? <Text style={styles.errorText}>{formErrors.name}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Contact Information</Text>
                        <TextInput
                            style={[
                                styles.formInput,
                                formErrors.contact && { borderColor: colors.red }
                            ]}
                            placeholder="Email address or phone number"
                            placeholderTextColor={colors.mediumGray}
                            value={newCustomerContact}
                            onChangeText={(text) => {
                                setNewCustomerContact(text);
                                if (formErrors.contact) {
                                    setFormErrors({ ...formErrors, contact: '' });
                                }
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {formErrors.contact ? <Text style={styles.errorText}>{formErrors.contact}</Text> : null}
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.inputLabel}>Weight (kg)</Text>
                            <TextInput
                                style={[
                                    styles.formInput,
                                    formErrors.weight && { borderColor: colors.red }
                                ]}
                                placeholder="Weight"
                                placeholderTextColor={colors.mediumGray}
                                value={newCustomerWeight}
                                onChangeText={(text) => {
                                    setNewCustomerWeight(text);
                                    if (formErrors.weight) {
                                        setFormErrors({ ...formErrors, weight: '' });
                                    }
                                }}
                                keyboardType="numeric"
                            />
                            {formErrors.weight ? <Text style={styles.errorText}>{formErrors.weight}</Text> : null}
                        </View>

                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.inputLabel}>Height (cm)</Text>
                            <TextInput
                                style={[
                                    styles.formInput,
                                    formErrors.height && { borderColor: colors.red }
                                ]}
                                placeholder="Height"
                                placeholderTextColor={colors.mediumGray}
                                value={newCustomerHeight}
                                onChangeText={(text) => {
                                    setNewCustomerHeight(text);
                                    if (formErrors.height) {
                                        setFormErrors({ ...formErrors, height: '' });
                                    }
                                }}
                                keyboardType="numeric"
                            />
                            {formErrors.height ? <Text style={styles.errorText}>{formErrors.height}</Text> : null}
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.inputLabel}>Cash Amount ($)</Text>
                            <TextInput
                                style={[
                                    styles.formInput,
                                    formErrors.cashAmount && { borderColor: colors.red }
                                ]}
                                placeholder="Amount"
                                placeholderTextColor={colors.mediumGray}
                                value={newCustomerCashAmount}
                                onChangeText={(text) => {
                                    setNewCustomerCashAmount(text);
                                    if (formErrors.cashAmount) {
                                        setFormErrors({ ...formErrors, cashAmount: '' });
                                    }
                                }}
                                keyboardType="numeric"
                            />
                            {formErrors.cashAmount ? <Text style={styles.errorText}>{formErrors.cashAmount}</Text> : null}
                        </View>

                        <View style={styles.inputGroupHalf}>
                            <Text style={styles.inputLabel}>Sessions Awarded</Text>
                            <TextInput
                                style={[
                                    styles.formInput,
                                    formErrors.sessionsAwarded && { borderColor: colors.red }
                                ]}
                                placeholder="Sessions"
                                placeholderTextColor={colors.mediumGray}
                                value={newCustomerSessionsAwarded}
                                onChangeText={(text) => {
                                    setNewCustomerSessionsAwarded(text);
                                    if (formErrors.sessionsAwarded) {
                                        setFormErrors({ ...formErrors, sessionsAwarded: '' });
                                    }
                                }}
                                keyboardType="numeric"
                            />
                            {formErrors.sessionsAwarded ? <Text style={styles.errorText}>{formErrors.sessionsAwarded}</Text> : null}
                        </View>
                    </View>

                    <View style={styles.formActions}>
                        {editingCustomer ? (
                            <>
                                <TouchableOpacity
                                    onPress={handleUpdateCustomer}
                                    style={[styles.updateButton, isLoading && { opacity: 0.7 }]}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.updateButtonText}>
                                        {isLoading ? 'Updating...' : 'Update Customer'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleCancelEdit}
                                    style={[styles.cancelButton, isLoading && { opacity: 0.7 }]}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                onPress={handleAddCustomer}
                                style={[styles.addButton, isLoading && { opacity: 0.7 }]}
                                disabled={isLoading}
                            >
                                <Text style={styles.addButtonText}>
                                    {isLoading ? 'Adding...' : 'Add Customer'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {/* Customers List Section */}
            <View style={styles.listSection}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>All Customers ({customers.length})</Text>
                </View>

                {customers.length > 0 ? (
                    <FlatList
                        data={customers}
                        renderItem={renderCustomerItem}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No customers added yet</Text>
                        <Text style={styles.emptyStateSubtext}>Add your first customer using the form above</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = {
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

    // Form Section
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
    inputGroup: {
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginBottom: 20,
    },
    inputGroupHalf: {
        flex: 1,
        marginHorizontal: 5,
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
    errorText: {
        color: colors.red,
        fontSize: 12,
        marginTop: 5,
    },

    // Action Buttons
    formActions: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        marginTop: 10,
    },
    addButton: {
        backgroundColor: colors.bottleGreen,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center' as const,
        minWidth: 140,
    },
    addButtonText: {
        color: colors.lightGray,
        fontSize: 16,
        fontWeight: '700' as const,
    },
    updateButton: {
        backgroundColor: colors.bottleGreen,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center' as const,
        marginHorizontal: 8,
    },
    updateButtonText: {
        color: colors.lightGray,
        fontSize: 14,
        fontWeight: '700' as const,
    },
    cancelButton: {
        backgroundColor: colors.mediumGray,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center' as const,
        marginHorizontal: 8,
    },
    cancelButtonText: {
        color: colors.lightGray,
        fontSize: 14,
        fontWeight: '700' as const,
    },

    // List Section
    listSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    listHeader: {
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.lightGray,
        textAlign: 'center' as const,
    },

    // Empty State
    emptyState: {
        alignItems: 'center' as const,
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.mediumGray,
        marginBottom: 8,
        textAlign: 'center' as const,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: colors.mediumGray,
        textAlign: 'center' as const,
        opacity: 0.8,
    },
};

export default ManageCustomersScreen;
