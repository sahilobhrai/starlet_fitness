import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
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
                name: newTrainerName.trim(),
                contact: newTrainerContact.trim(),
                specialization: newTrainerSpecialization.trim(),
            };
            setTrainers([...trainers, newTrainer]);
            setNewTrainerName('');
            setNewTrainerContact('');
            setNewTrainerSpecialization('');
        }
    };

    const handleDeleteTrainer = (id: string) => {
        Alert.alert(
            "Delete Trainer",
            "Are you sure you want to remove this trainer?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => setTrainers(trainers.filter(trainer => trainer.id !== id)) }
            ]
        );
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
                trainer.id === editingTrainer.id ? {
                    ...trainer,
                    name: newTrainerName.trim(),
                    contact: newTrainerContact.trim(),
                    specialization: newTrainerSpecialization.trim()
                } : trainer
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
        <View style={styles.trainerCard}>
            <View style={styles.trainerInfo}>
                <View style={styles.trainerHeader}>
                    <Text style={styles.trainerName}>{item.name}</Text>
                    <Text style={styles.trainerSpecialization}>{item.specialization}</Text>
                </View>
                <Text style={styles.trainerContact}>{item.contact}</Text>
            </View>
            <View style={styles.trainerActions}>
                <TouchableOpacity
                    onPress={() => handleEditTrainer(item)}
                    style={styles.actionButton}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteTrainer(item.id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.pageTitle}>Manage Trainers</Text>
                <Text style={styles.pageSubtitle}>Add, edit, and manage your fitness trainers</Text>
            </View>

            {/* Add/Edit Form Section */}
            <View style={styles.formSection}>
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>
                        {editingTrainer ? '✏️ Edit Trainer' : '➕ Add New Trainer'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder="Enter trainer's full name"
                            placeholderTextColor={colors.mediumGray}
                            value={newTrainerName}
                            onChangeText={setNewTrainerName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Contact Information</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder="Email address or phone number"
                            placeholderTextColor={colors.mediumGray}
                            value={newTrainerContact}
                            onChangeText={setNewTrainerContact}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Specialization</Text>
                        <TextInput
                            style={styles.formInput}
                            placeholder="e.g., Weight Training, Yoga, Cardio"
                            placeholderTextColor={colors.mediumGray}
                            value={newTrainerSpecialization}
                            onChangeText={setNewTrainerSpecialization}
                        />
                    </View>

                    <View style={styles.formActions}>
                        {editingTrainer ? (
                            <>
                                <TouchableOpacity
                                    onPress={handleUpdateTrainer}
                                    style={styles.updateButton}
                                >
                                    <Text style={styles.updateButtonText}>Update Trainer</Text>
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
                                onPress={handleAddTrainer}
                                style={styles.addButton}
                            >
                                <Text style={styles.addButtonText}>Add Trainer</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {/* Trainers List Section */}
            <View style={styles.listSection}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>All Trainers ({trainers.length})</Text>
                </View>

                {trainers.length > 0 ? (
                    <FlatList
                        data={trainers}
                        renderItem={renderTrainerItem}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No trainers added yet</Text>
                        <Text style={styles.emptyStateSubtext}>Add your first trainer using the form above</Text>
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

    // Trainer Cards
    trainerCard: {
        backgroundColor: colors.darkGray,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    trainerInfo: {
        flex: 1,
    },
    trainerHeader: {
        marginBottom: 8,
    },
    trainerName: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.lightGray,
        marginBottom: 4,
    },
    trainerSpecialization: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.bottleGreen,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5,
    },
    trainerContact: {
        fontSize: 14,
        color: colors.mediumGray,
    },
    trainerActions: {
        flexDirection: 'row' as const,
        gap: 8,
    },
    actionButton: {
        backgroundColor: colors.bottleGreen,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center' as const,
    },
    editButtonText: {
        color: colors.lightGray,
        fontSize: 12,
        fontWeight: '700' as const,
    },
    deleteButton: {
        backgroundColor: colors.red,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center' as const,
    },
    deleteButtonText: {
        color: colors.lightGray,
        fontSize: 12,
        fontWeight: '700' as const,
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

export default ManageTrainersScreen;
