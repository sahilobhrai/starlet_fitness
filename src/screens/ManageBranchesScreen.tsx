import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

interface Branch {
    id: string;
    name: string;
    location: string;
}

const ManageBranchesScreen = () => {
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
        setBranches(branches.filter(branch => branch.id !== id));
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
        <View style={styles.branchItem}>
            <View style={styles.branchInfo}>
                <Text style={styles.branchName}>{item.name}</Text>
                <Text style={styles.branchLocation}>{item.location}</Text>
            </View>
            <View style={styles.branchActions}>
                <TouchableOpacity onPress={() => handleEditBranch(item)} style={[styles.button, styles.editButton]}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteBranch(item.id)} style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Manage Branches</Text>

            <View style={styles.formCard}>
                <Text style={styles.formTitle}>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Branch Name"
                    value={newBranchName}
                    onChangeText={setNewBranchName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={newBranchLocation}
                    onChangeText={setNewBranchLocation}
                />
                {editingBranch ? (
                    <View style={styles.formActions}>
                        <Button title="Update Branch" onPress={handleUpdateBranch} color="#007bff" />
                        <Button title="Cancel" onPress={handleCancelEdit} color="#6c757d" />
                    </View>
                ) : (
                    <Button title="Add Branch" onPress={handleAddBranch} color="#28a745" />
                )}
            </View>

            <View style={styles.listCard}>
                <Text style={styles.listTitle}>All Branches</Text>
                <FlatList
                    data={branches}
                    renderItem={renderBranchItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyListText}>No branches added yet.</Text>}
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
    branchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    branchInfo: {
        flex: 1,
        marginRight: 10,
    },
    branchName: {
        fontSize: 17,
        fontWeight: '500',
        color: '#333',
    },
    branchLocation: {
        fontSize: 15,
        color: '#666',
    },
    branchActions: {
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

export default ManageBranchesScreen;
