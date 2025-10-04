import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

interface Branch {
    id: string;
    name: string;
    location: string;
}

// Added navigation prop
const ManageBranchesScreen = ({ navigation }: { navigation: any }) => {
    const [branches, setBranches] = useState<Branch[]>([
        { id: '1', name: 'Downtown Branch', location: '123 Main St' },
        { id: '2', name: 'Uptown Branch', location: '456 Oak Ave' },
    ]);
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchLocation, setNewBranchLocation] = useState('');
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const handleAddBranch = () => {
        if (newBranchName.trim() && newBranchLocation.trim()) {
            const newBranch: Branch = {
                id: Date.now().toString(),
                name: newBranchName,
                location: newBranchLocation,
            };
            setBranches([...branches, newBranch]);
            setNewBranchName('');
            setNewBranchLocation('');
        }
    };

    const handleDeleteBranch = (id: string) => {
        Alert.alert(
            'Delete Branch',
            'Are you sure you want to delete this branch? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setBranches(branches.filter(branch => branch.id !== id));
                        Alert.alert('Success', 'Branch deleted successfully!');
                    }
                }
            ]
        );
    };

    const handleEditBranch = (branch: Branch) => {
        setEditingBranch(branch);
        setNewBranchName(branch.name);
        setNewBranchLocation(branch.location);
    };

    const handleUpdateBranch = () => {
        if (editingBranch && newBranchName.trim() && newBranchLocation.trim()) {
            setBranches(branches.map(branch =>
                branch.id === editingBranch.id ? { ...branch, name: newBranchName, location: newBranchLocation } : branch
            ));
            setEditingBranch(null);
            setNewBranchName('');
            setNewBranchLocation('');
        }
    };

    const handleCancelEdit = () => {
        setEditingBranch(null);
        setNewBranchName('');
        setNewBranchLocation('');
    };

    const renderBranchItem = ({ item }: { item: Branch }) => (
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
                        }}>ACTIVE BRANCH</Text>
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
                }}>📍 Location Details</Text>
                <Text style={{
                    fontSize: 14,
                    color: colors.mediumGray,
                }}>{item.location}</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: colors.mediumGray + '30',
                paddingTop: 12,
            }}>
                <TouchableOpacity
                    onPress={() => handleEditBranch(item)}
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
                    onPress={() => handleDeleteBranch(item.id)}
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

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.lightGray} />
            </TouchableOpacity>
            <ScrollView style={AppStyles.mainContent}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.pageTitle}>Manage Branches</Text>
                    <Text style={styles.pageSubtitle}>Add, edit, and manage your fitness branch locations</Text>
                </View>

                {/* Add/Edit Form Section */}
                <View style={styles.formSection}>
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>
                            {editingBranch ? '✏️ Edit Branch' : '➕ Add New Branch'}
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Branch Name</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter branch name"
                                placeholderTextColor={colors.mediumGray}
                                value={newBranchName}
                                onChangeText={setNewBranchName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Location Address</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter full address"
                                placeholderTextColor={colors.mediumGray}
                                value={newBranchLocation}
                                onChangeText={setNewBranchLocation}
                            />
                        </View>

                        <View style={styles.formActions}>
                            {editingBranch ? (
                                <>
                                    <TouchableOpacity
                                        onPress={handleUpdateBranch}
                                        style={styles.updateButton}
                                    >
                                        <Text style={styles.updateButtonText}>Update Branch</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleCancelEdit}
                                        style={styles.cancelButton}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleAddBranch}
                                    style={styles.addButton}
                                >
                                    <Text style={styles.addButtonText}>Add Branch</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Branches List Section */}
                <View style={styles.listSection}>
                    <View style={styles.listHeader}>
                        <Text style={styles.listTitle}>All Branches ({branches.length})</Text>
                    </View>

                    {branches.length > 0 ? (
                        <FlatList
                            data={branches}
                            renderItem={renderBranchItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: colors.bottleGreen + '20',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 20,
                            }}>
                                <Text style={{
                                    fontSize: 40,
                                    color: colors.bottleGreen,
                                }}>🏢</Text>
                            </View>
                            <Text style={styles.emptyStateText}>No Branches Yet</Text>
                            <Text style={styles.emptyStateSubtext}>Start expanding your fitness business by adding your first branch location using the form above.</Text>
                            <View style={{
                                backgroundColor: colors.bottleGreen + '20',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                marginTop: 15,
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.bottleGreen,
                                    fontWeight: 'bold',
                                }}>💡 Tip: Add multiple locations to serve more customers</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

// Define comprehensive styles matching ManageTrainersScreen pattern
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
});

export default ManageBranchesScreen;
