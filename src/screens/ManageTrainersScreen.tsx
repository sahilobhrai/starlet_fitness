import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

interface Trainer {
    id: string;
    name: string;
    contact: string;
    specialization: string;
}

const ManageTrainersScreen = ({ navigation }: { navigation: any }) => {
    const [trainers, setTrainers] = useState<Trainer[]>([
        { id: '1', name: 'John Smith', contact: 'john.smith@example.com', specialization: 'Weightlifting' },
        { id: '2', name: 'Emily Johnson', contact: 'emily.j@example.com', specialization: 'Yoga' },
    ]);
    const [newTrainerName, setNewTrainerName] = useState('');
    const [newTrainerContact, setNewTrainerContact] = useState('');
    const [newTrainerSpecialization, setNewTrainerSpecialization] = useState('');
    const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);

    const handleAddTrainer = () => {
        if (newTrainerName.trim() && newTrainerContact.trim() && newTrainerSpecialization.trim()) {
            const newTrainer: Trainer = {
                id: Date.now().toString(),
                name: newTrainerName,
                contact: newTrainerContact,
                specialization: newTrainerSpecialization,
            };
            setTrainers([...trainers, newTrainer]);
            setNewTrainerName('');
            setNewTrainerContact('');
            setNewTrainerSpecialization('');
        }
    };

    const handleDeleteTrainer = (id: string) => {
        setTrainers(trainers.filter(trainer => trainer.id !== id));
    };

    const handleEditTrainer = (trainer: Trainer) => {
        setEditingTrainer(trainer);
        setNewTrainerName(trainer.name);
        setNewTrainerContact(trainer.contact);
        setNewTrainerSpecialization(trainer.specialization);
    };

    const handleUpdateTrainer = () => {
        if (editingTrainer && newTrainerName.trim() && newTrainerContact.trim() && newTrainerSpecialization.trim()) {
            setTrainers(trainers.map(trainer =>
                trainer.id === editingTrainer.id ? { ...trainer, name: newTrainerName, contact: newTrainerContact, specialization: newTrainerSpecialization } : trainer
            ));
            setEditingTrainer(null);
            setNewTrainerName('');
            setNewTrainerContact('');
            setNewTrainerSpecialization('');
        }
    };

    const handleCancelEdit = () => {
        setEditingTrainer(null);
        setNewTrainerName('');
        setNewTrainerContact('');
        setNewTrainerSpecialization('');
    };

    const renderTrainerItem = ({ item }: { item: Trainer }) => (
        <View style={AppStyles.detailRow}>
            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.trainerInfo with AppStyles.profileDetailsContainer as trainerInfo is not in AppStyles */}
                <Text style={AppStyles.profileName}>{item.name}</Text>
                <Text style={AppStyles.profileDetailText}>{item.contact}</Text>
                <Text style={AppStyles.profileDetailText}>{item.specialization}</Text>
            </View>
            <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.trainerActions with AppStyles.modalButtonContainer */}
                <TouchableOpacity onPress={() => handleEditTrainer(item)} style={[AppStyles.modalButton, { backgroundColor: '#ffc107', marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.editButton with AppStyles.modalButton and specific color */}
                    <Text style={AppStyles.modalButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTrainer(item.id)} style={[AppStyles.modalButton, { backgroundColor: colors.red, marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.deleteButton with AppStyles.modalButton and colors.red */}
                    <Text style={AppStyles.modalButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}>
            <Text style={AppStyles.pageTitle}>Manage Trainers</Text> {/* Replaced styles.header with AppStyles.pageTitle */}

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.formCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>{editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}</Text> {/* Replaced styles.formTitle with AppStyles.profileSectionTitle */}
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Trainer Name"
                    value={newTrainerName}
                    onChangeText={setNewTrainerName}
                />
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Contact Info (Email/Phone)"
                    value={newTrainerContact}
                    onChangeText={setNewTrainerContact}
                />
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Specialization"
                    value={newTrainerSpecialization}
                    onChangeText={setNewTrainerSpecialization}
                />
                {editingTrainer ? (
                    <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.formActions with AppStyles.modalButtonContainer */}
                        <TouchableOpacity onPress={handleUpdateTrainer} style={[AppStyles.modalButton, { backgroundColor: '#007bff', marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.updateButton with AppStyles.modalButton and specific color */}
                            <Text style={AppStyles.modalButtonText}>Update Trainer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelEdit} style={[AppStyles.modalButton, { backgroundColor: colors.mediumGray, marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.cancelButton with AppStyles.modalButton and colors.mediumGray */}
                            <Text style={AppStyles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleAddTrainer} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5 }]}> {/* Replaced styles.addButton with AppStyles.modalButton and colors.bottleGreen */}
                        <Text style={AppStyles.modalButtonText}>Add Trainer</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.listCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>All Trainers</Text> {/* Replaced styles.listTitle with AppStyles.profileSectionTitle */}
                <FlatList
                    data={trainers}
                    renderItem={renderTrainerItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={AppStyles.modalText}>No trainers added yet.</Text>}
                />
            </View>
        </ScrollView>
    );
};

// Removed the local styles object as requested.
// Styles are now imported from AppStyles.

export default ManageTrainersScreen;
