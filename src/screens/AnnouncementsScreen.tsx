import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon
// Import colors from the theme
import { colors } from '../theme/colors';
// Import global AppStyles
import { AppStyles } from '../styles/AppStyles';

interface Announcement {
    id: string;
    title: string;
    message: string;
    sentTo: 'all' | 'trainers' | 'customers';
    timestamp: string;
}

// Added navigation prop
const AnnouncementsScreen = ({ navigation }: { navigation: any }) => {
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
        <View style={AppStyles.detailRow}>
            <View style={AppStyles.profileDetailsContainer}>
                <Text style={AppStyles.profileName}>{item.title}</Text>
                <Text style={AppStyles.profileDetailText}>{item.message}</Text>
                <Text style={AppStyles.profileDetailText}>
                    Sent to: {item.sentTo.charAt(0).toUpperCase() + item.sentTo.slice(1)} | Sent on: {item.timestamp}
                </Text>
            </View>
            <View style={AppStyles.modalButtonContainer}>
                <TouchableOpacity onPress={() => handleEditAnnouncement(item)} style={[AppStyles.modalButton, { backgroundColor: '#ffc107', marginHorizontal: 5 }]}>
                    <Text style={AppStyles.modalButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAnnouncement(item.id)} style={[AppStyles.modalButton, { backgroundColor: colors.red, marginHorizontal: 5 }]}>
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
                <Text style={AppStyles.pageTitle}>Announcements</Text>

                <View style={AppStyles.profileDetailsContainer}>
                    <Text style={AppStyles.profileSectionTitle}>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</Text>
                    <TextInput
                        style={AppStyles.profileInput}
                        placeholder="Announcement Title"
                        value={newAnnouncementTitle}
                        onChangeText={setNewAnnouncementTitle}
                    />
                    <TextInput
                        style={[AppStyles.profileInput, { height: 100, textAlignVertical: 'top' }]}
                        placeholder="Announcement Message"
                        value={newAnnouncementMessage}
                        onChangeText={setNewAnnouncementMessage}
                        multiline
                    />
                    <View style={AppStyles.detailRow}>
                        <Text style={AppStyles.profileDetailText}>Send To:</Text>
                        <View style={AppStyles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[AppStyles.modalButton, { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: newAnnouncementTarget === 'all' ? colors.primary : '#ccc', backgroundColor: newAnnouncementTarget === 'all' ? colors.primary : '#f9f9f9', marginHorizontal: 5 }]}
                                onPress={() => setNewAnnouncementTarget('all')}
                            >
                                <Text style={[AppStyles.modalButtonText, { color: newAnnouncementTarget === 'all' ? colors.lightGray : colors.darkGray, fontWeight: newAnnouncementTarget === 'all' ? 'bold' : 'normal' }]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[AppStyles.modalButton, { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: newAnnouncementTarget === 'trainers' ? colors.primary : '#ccc', backgroundColor: newAnnouncementTarget === 'trainers' ? colors.primary : '#f9f9f9', marginHorizontal: 5 }]}
                                onPress={() => setNewAnnouncementTarget('trainers')}
                            >
                                <Text style={[AppStyles.modalButtonText, { color: newAnnouncementTarget === 'trainers' ? colors.lightGray : colors.darkGray, fontWeight: newAnnouncementTarget === 'trainers' ? 'bold' : 'normal' }]}>Trainers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[AppStyles.modalButton, { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: newAnnouncementTarget === 'customers' ? colors.primary : '#ccc', backgroundColor: newAnnouncementTarget === 'customers' ? colors.primary : '#f9f9f9', marginHorizontal: 5 }]}
                                onPress={() => setNewAnnouncementTarget('customers')}
                            >
                                <Text style={[AppStyles.modalButtonText, { color: newAnnouncementTarget === 'customers' ? colors.lightGray : colors.darkGray, fontWeight: newAnnouncementTarget === 'customers' ? 'bold' : 'normal' }]}>Customers</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {editingAnnouncement ? (
                        <View style={AppStyles.modalButtonContainer}>
                            <TouchableOpacity onPress={handleUpdateAnnouncement} style={[AppStyles.modalButton, { backgroundColor: '#007bff', marginHorizontal: 5 }]}>
                                <Text style={AppStyles.modalButtonText}>Update Announcement</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={[AppStyles.modalButton, { backgroundColor: colors.mediumGray, marginHorizontal: 5 }]}>
                                <Text style={AppStyles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handleAddAnnouncement} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5 }]}>
                            <Text style={AppStyles.modalButtonText}>Send Announcement</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={AppStyles.profileDetailsContainer}>
                    <Text style={AppStyles.profileSectionTitle}>All Announcements</Text>
                    <FlatList
                        data={announcements}
                        renderItem={renderAnnouncementItem}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<Text style={AppStyles.modalText}>No announcements sent yet.</Text>}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

// Define local styles for the back button and container
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

export default AnnouncementsScreen;
