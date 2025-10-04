import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon
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
        <View style={AppStyles.detailRow}>
            <View style={AppStyles.profileDetailsContainer}>
                <Text style={AppStyles.profileName}>{item.name}</Text>
                <Text style={AppStyles.profileDetailText}>{item.location}</Text>
            </View>
            <View style={AppStyles.modalButtonContainer}>
                <TouchableOpacity onPress={() => handleEditBranch(item)} style={[AppStyles.modalButton, { backgroundColor: '#ffc107', marginHorizontal: 5 }]}>
                    <Text style={AppStyles.modalButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteBranch(item.id)} style={[AppStyles.modalButton, { backgroundColor: colors.red, marginHorizontal: 5 }]}>
                    <Text style={AppStyles.modalButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}> {/* Main container for absolute positioning */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={colors.lightGray} />
            </TouchableOpacity>
            <ScrollView style={AppStyles.mainContent}> {/* Content scrollable */}
                <Text style={AppStyles.pageTitle}>Manage Branches</Text>

                <View style={AppStyles.profileDetailsContainer}>
                    <Text style={AppStyles.profileSectionTitle}>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</Text>
                    <TextInput
                        style={AppStyles.profileInput}
                        placeholder="Branch Name"
                        value={newBranchName}
                        onChangeText={setNewBranchName}
                    />
                    <TextInput
                        style={AppStyles.profileInput}
                        placeholder="Location"
                        value={newBranchLocation}
                        onChangeText={setNewBranchLocation}
                    />
                    {editingBranch ? (
                        <View style={AppStyles.modalButtonContainer}>
                            <TouchableOpacity onPress={handleUpdateBranch} style={[AppStyles.modalButton, { backgroundColor: '#007bff', marginHorizontal: 5 }]}>
                                <Text style={AppStyles.modalButtonText}>Update Branch</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={[AppStyles.modalButton, { backgroundColor: colors.mediumGray, marginHorizontal: 5 }]}>
                                <Text style={AppStyles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handleAddBranch} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5 }]}>
                            <Text style={AppStyles.modalButtonText}>Add Branch</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={AppStyles.profileDetailsContainer}>
                    <Text style={AppStyles.profileSectionTitle}>All Branches</Text>
                    <FlatList
                        data={branches}
                        renderItem={renderBranchItem}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<Text style={AppStyles.modalText}>No branches added yet.</Text>}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

// Define local styles for the back button
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

export default ManageBranchesScreen;
