import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

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
        <View style={AppStyles.detailRow}> {/* Replaced styles.branchItem with AppStyles.detailRow */}
            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.branchInfo with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileName}>{item.name}</Text> {/* Replaced styles.branchName with AppStyles.profileName */}
                <Text style={AppStyles.profileDetailText}>{item.location}</Text> {/* Replaced styles.branchLocation with AppStyles.profileDetailText */}
            </View>
            <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.branchActions with AppStyles.modalButtonContainer */}
                <TouchableOpacity onPress={() => handleEditBranch(item)} style={[AppStyles.modalButton, { backgroundColor: '#ffc107', marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.editButton with AppStyles.modalButton and specific color */}
                    <Text style={AppStyles.modalButtonText}>Edit</Text> {/* Replaced styles.buttonText with AppStyles.modalButtonText */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteBranch(item.id)} style={[AppStyles.modalButton, { backgroundColor: colors.red, marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.deleteButton with AppStyles.modalButton and colors.red */}
                    <Text style={AppStyles.modalButtonText}>Remove</Text> {/* Replaced styles.buttonText with AppStyles.modalButtonText */}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}> {/* Replaced styles.container with AppStyles.mainContent */}
            <Text style={AppStyles.pageTitle}>Manage Branches</Text> {/* Replaced styles.header with AppStyles.pageTitle */}

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.formCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</Text> {/* Replaced styles.formTitle with AppStyles.profileSectionTitle */}
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Branch Name"
                    value={newBranchName}
                    onChangeText={setNewBranchName}
                />
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Location"
                    value={newBranchLocation}
                    onChangeText={setNewBranchLocation}
                />
                {editingBranch ? (
                    <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.formActions with AppStyles.modalButtonContainer */}
                        <TouchableOpacity onPress={handleUpdateBranch} style={[AppStyles.modalButton, { backgroundColor: '#007bff', marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                            <Text style={AppStyles.modalButtonText}>Update Branch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelEdit} style={[AppStyles.modalButton, { backgroundColor: colors.mediumGray, marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                            <Text style={AppStyles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleAddBranch} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                        <Text style={AppStyles.modalButtonText}>Add Branch</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.listCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>All Branches</Text> {/* Replaced styles.listTitle with AppStyles.profileSectionTitle */}
                <FlatList
                    data={branches}
                    renderItem={renderBranchItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={AppStyles.modalText}>No branches added yet.</Text>}
                />
            </View>
        </ScrollView>
    );
};

// Removed the local styles object as requested.
// Styles are now imported from AppStyles.

export default ManageBranchesScreen;
