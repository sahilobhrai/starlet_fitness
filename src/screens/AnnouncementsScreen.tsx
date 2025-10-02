import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

interface Announcement {
    id: string;
    title: string;
    message: string;
    sentTo: 'all' | 'trainers' | 'customers';
    timestamp: string;
}

const AnnouncementsScreen = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([
        { id: '1', title: 'System Maintenance', message: 'Scheduled maintenance this Sunday from 2 AM to 4 AM.', sentTo: 'all', timestamp: '2025-10-01 10:00 AM' },
        { id: '2', title: 'New Feature Launch', message: 'Exciting new feature coming next week!', sentTo: 'customers', timestamp: '2025-09-28 03:00 PM' },
    ]);
    const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
    const [newAnnouncementMessage, setNewAnnouncementMessage] = useState('');
    const [newAnnouncementTarget, setNewAnnouncementTarget] = useState<'all' | 'trainers' | 'customers'>('all');
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const handleAddAnnouncement = () => {
        if (newAnnouncementTitle.trim() && newAnnouncementMessage.trim()) {
            const newAnnouncement: Announcement = {
                id: Date.now().toString(),
                title: newAnnouncementTitle,
                message: newAnnouncementMessage,
                sentTo: newAnnouncementTarget,
                timestamp: new Date().toLocaleString(),
            };
            setAnnouncements([...announcements, newAnnouncement]);
            // Clear form
            setNewAnnouncementTitle('');
            setNewAnnouncementMessage('');
            setNewAnnouncementTarget('all');
        } else {
            Alert.alert('Please enter both title and message for the announcement.');
        }
    };

    const handleDeleteAnnouncement = (id: string) => {
        setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    };

    const handleEditAnnouncement = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setNewAnnouncementTitle(announcement.title);
        setNewAnnouncementMessage(announcement.message);
        setNewAnnouncementTarget(announcement.sentTo);
    };

    const handleUpdateAnnouncement = () => {
        if (editingAnnouncement && newAnnouncementTitle.trim() && newAnnouncementMessage.trim()) {
            setAnnouncements(announcements.map(announcement =>
                announcement.id === editingAnnouncement.id ? {
                    ...announcement,
                    title: newAnnouncementTitle,
                    message: newAnnouncementMessage,
                    sentTo: newAnnouncementTarget,
                } : announcement
            ));
            // Clear form and reset editing state
            setEditingAnnouncement(null);
            setNewAnnouncementTitle('');
            setNewAnnouncementMessage('');
            setNewAnnouncementTarget('all');
        } else {
            Alert.alert('Please enter both title and message for the announcement.');
        }
    };

    const handleCancelEdit = () => {
        setEditingAnnouncement(null);
        // Clear form
        setNewAnnouncementTitle('');
        setNewAnnouncementMessage('');
        setNewAnnouncementTarget('all');
    };

    const renderAnnouncementItem = ({ item }: { item: Announcement }) => (
        <View style={styles.announcementItem}>
            <View style={styles.announcementInfo}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementMessage}>{item.message}</Text>
                <Text style={styles.announcementMeta}>
                    Sent to: {item.sentTo.charAt(0).toUpperCase() + item.sentTo.slice(1)} | Sent on: {item.timestamp}
                </Text>
            </View>
            <View style={styles.announcementActions}>
                <TouchableOpacity onPress={() => handleEditAnnouncement(item)} style={[styles.button, styles.editButton]}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAnnouncement(item.id)} style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Announcements</Text>

            <View style={styles.formCard}>
                <Text style={styles.formTitle}>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Announcement Title"
                    value={newAnnouncementTitle}
                    onChangeText={setNewAnnouncementTitle}
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Announcement Message"
                    value={newAnnouncementMessage}
                    onChangeText={setNewAnnouncementMessage}
                    multiline
                />
                <View style={styles.targetContainer}>
                    <Text style={styles.targetLabel}>Send To:</Text>
                    <View style={styles.radioButtons}>
                        <TouchableOpacity
                            style={[styles.radioButton, newAnnouncementTarget === 'all' && styles.radioButtonSelected]}
                            onPress={() => setNewAnnouncementTarget('all')}
                        >
                            <Text style={[styles.radioButtonText, newAnnouncementTarget === 'all' && styles.radioButtonTextSelected]}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.radioButton, newAnnouncementTarget === 'trainers' && styles.radioButtonSelected]}
                            onPress={() => setNewAnnouncementTarget('trainers')}
                        >
                            <Text style={[styles.radioButtonText, newAnnouncementTarget === 'trainers' && styles.radioButtonTextSelected]}>Trainers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.radioButton, newAnnouncementTarget === 'customers' && styles.radioButtonSelected]}
                            onPress={() => setNewAnnouncementTarget('customers')}
                        >
                            <Text style={[styles.radioButtonText, newAnnouncementTarget === 'customers' && styles.radioButtonTextSelected]}>Customers</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {editingAnnouncement ? (
                    <View style={styles.formActions}>
                        <Button title="Update Announcement" onPress={handleUpdateAnnouncement} color="#007bff" />
                        <Button title="Cancel" onPress={handleCancelEdit} color="#6c757d" />
                    </View>
                ) : (
                    <Button title="Send Announcement" onPress={handleAddAnnouncement} color="#28a745" />
                )}
            </View>

            <View style={styles.listCard}>
                <Text style={styles.listTitle}>All Announcements</Text>
                <FlatList
                    data={announcements}
                    renderItem={renderAnnouncementItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyListText}>No announcements sent yet.</Text>}
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
        padding: 20,
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
    textArea: {
        height: 100, // Increased height for message input
        textAlignVertical: 'top', // For Android, to align text to the top
    },
    targetContainer: {
        marginBottom: 15,
    },
    targetLabel: {
        fontSize: 16,
        color: '#444',
        marginBottom: 10,
    },
    radioButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    radioButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    radioButtonSelected: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    radioButtonText: {
        fontSize: 15,
        color: '#444',
    },
    radioButtonTextSelected: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    listCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
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
    announcementItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    announcementInfo: {
        flex: 1,
        marginRight: 10,
    },
    announcementTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#333',
    },
    announcementMessage: {
        fontSize: 15,
        color: '#666',
        marginTop: 5,
    },
    announcementMeta: {
        fontSize: 13,
        color: '#888',
        marginTop: 5,
    },
    announcementActions: {
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

export default AnnouncementsScreen;
