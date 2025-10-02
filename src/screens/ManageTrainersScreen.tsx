import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

interface Trainer {
    id: string;
    name: string;
    contact: string;
    specialization: string;
}

const ManageTrainersScreen = () => {
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
        <View style={styles.trainerItem}>
            <View style={styles.trainerInfo}>
                <Text style={styles.trainerName}>{item.name}</Text>
                <Text style={styles.trainerContact}>{item.contact}</Text>
                <Text style={styles.trainerSpecialization}>{item.specialization}</Text>
            </View>
            <View style={styles.trainerActions}>
                <TouchableOpacity onPress={() => handleEditTrainer(item)} style={[styles.button, styles.editButton]}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTrainer(item.id)} style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Manage Trainers</Text>

            <View style={styles.formCard}>
                <Text style={styles.formTitle}>{editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Trainer Name"
                    value={newTrainerName}
                    onChangeText={setNewTrainerName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Info (Email/Phone)"
                    value={newTrainerContact}
                    onChangeText={setNewTrainerContact}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Specialization"
                    value={newTrainerSpecialization}
                    onChangeText={setNewTrainerSpecialization}
                />
                {editingTrainer ? (
                    <View style={styles.formActions}>
                        <Button title="Update Trainer" onPress={handleUpdateTrainer} color="#007bff" />
                        <Button title="Cancel" onPress={handleCancelEdit} color="#6c757d" />
                    </View>
                ) : (
                    <Button title="Add Trainer" onPress={handleAddTrainer} color="#28a745" />
                )}
            </View>

            <View style={styles.listCard}>
                <Text style={styles.listTitle}>All Trainers</Text>
                <FlatList
                    data={trainers}
                    renderItem={renderTrainerItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyListText}>No trainers added yet.</Text>}
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
    trainerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    trainerInfo: {
        flex: 1,
        marginRight: 10,
    },
    trainerName: {
        fontSize: 17,
        fontWeight: '500',
        color: '#333',
    },
    trainerContact: {
        fontSize: 15,
        color: '#666',
    },
    trainerSpecialization: {
        fontSize: 15,
        color: '#666',
        fontStyle: 'italic',
    },
    trainerActions: {
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

export default ManageTrainersScreen;
