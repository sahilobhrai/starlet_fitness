import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
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
        <View style={AppStyles.detailRow}> {/* Replaced styles.announcementItem with AppStyles.detailRow */}
            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.announcementInfo with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileName}>{item.title}</Text> {/* Replaced styles.announcementTitle with AppStyles.profileName */}
                <Text style={AppStyles.profileDetailText}>{item.message}</Text> {/* Replaced styles.announcementMessage with AppStyles.profileDetailText */}
                <Text style={AppStyles.profileDetailText}>
                    Sent to: {item.sentTo.charAt(0).toUpperCase() + item.sentTo.slice(1)} | Sent on: {item.timestamp}
                </Text> {/* Replaced styles.announcementMeta with AppStyles.profileDetailText */}
            </View>
            <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.announcementActions with AppStyles.modalButtonContainer */}
                <TouchableOpacity onPress={() => handleEditAnnouncement(item)} style={[AppStyles.modalButton, { backgroundColor: '#ffc107', marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.editButton with AppStyles.modalButton and specific color */}
                    <Text style={AppStyles.modalButtonText}>Edit</Text> {/* Replaced styles.buttonText with AppStyles.modalButtonText */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAnnouncement(item.id)} style={[AppStyles.modalButton, { backgroundColor: colors.red, marginHorizontal: 5 }]}> {/* Replaced styles.button, styles.deleteButton with AppStyles.modalButton and colors.red */}
                    <Text style={AppStyles.modalButtonText}>Remove</Text> {/* Replaced styles.buttonText with AppStyles.modalButtonText */}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={AppStyles.mainContent}> {/* Replaced styles.container with AppStyles.mainContent */}
            <Text style={AppStyles.pageTitle}>Announcements</Text> {/* Replaced styles.header with AppStyles.pageTitle */}

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.formCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</Text> {/* Replaced styles.formTitle with AppStyles.profileSectionTitle */}
                <TextInput
                    style={AppStyles.profileInput} // Replaced styles.input with AppStyles.profileInput
                    placeholder="Announcement Title"
                    value={newAnnouncementTitle}
                    onChangeText={setNewAnnouncementTitle}
                />
                <TextInput
                    style={[AppStyles.profileInput, { height: 100, textAlignVertical: 'top' }]} // Replaced styles.input, styles.textArea with AppStyles.profileInput and inline styles
                    placeholder="Announcement Message"
                    value={newAnnouncementMessage}
                    onChangeText={setNewAnnouncementMessage}
                    multiline
                />
                <View style={AppStyles.detailRow}> {/* Replaced styles.targetContainer with AppStyles.detailRow */}
                    <Text style={AppStyles.profileDetailText}>Send To:</Text> {/* Replaced styles.targetLabel with AppStyles.profileDetailText */}
                    <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.radioButtons with AppStyles.modalButtonContainer */}
                        <TouchableOpacity
                            style={[AppStyles.modalButton, { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: newAnnouncementTarget === 'all' ? colors.primary : '#ccc', backgroundColor: newAnnouncementTarget === 'all' ? colors.primary : '#f9f9f9', marginHorizontal: 5 }]} // Using AppStyles.modalButton and conditional styles
                            onPress={() => setNewAnnouncementTarget('all')}
                        >
                            <Text style={[AppStyles.modalButtonText, { color: newAnnouncementTarget === 'all' ? colors.lightGray : colors.darkGray, fontWeight: newAnnouncementTarget === 'all' ? 'bold' : 'normal' }]}>All</Text> {/* Using AppStyles.modalButtonText and conditional text styles */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[AppStyles.modalButton, { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: newAnnouncementTarget === 'trainers' ? colors.primary : '#ccc', backgroundColor: newAnnouncementTarget === 'trainers' ? colors.primary : '#f9f9f9', marginHorizontal: 5 }]} // Using AppStyles.modalButton and conditional styles
                            onPress={() => setNewAnnouncementTarget('trainers')}
                        >
                            <Text style={[AppStyles.modalButtonText, { color: newAnnouncementTarget === 'trainers' ? colors.lightGray : colors.darkGray, fontWeight: newAnnouncementTarget === 'trainers' ? 'bold' : 'normal' }]}>Trainers</Text> {/* Using AppStyles.modalButtonText and conditional text styles */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[AppStyles.modalButton, { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: newAnnouncementTarget === 'customers' ? colors.primary : '#ccc', backgroundColor: newAnnouncementTarget === 'customers' ? colors.primary : '#f9f9f9', marginHorizontal: 5 }]} // Using AppStyles.modalButton and conditional styles
                            onPress={() => setNewAnnouncementTarget('customers')}
                        >
                            <Text style={[AppStyles.modalButtonText, { color: newAnnouncementTarget === 'customers' ? colors.lightGray : colors.darkGray, fontWeight: newAnnouncementTarget === 'customers' ? 'bold' : 'normal' }]}>Customers</Text> {/* Using AppStyles.modalButtonText and conditional text styles */}
                        </TouchableOpacity>
                    </View>
                </View>

                {editingAnnouncement ? (
                    <View style={AppStyles.modalButtonContainer}> {/* Replaced styles.formActions with AppStyles.modalButtonContainer */}
                        <TouchableOpacity onPress={handleUpdateAnnouncement} style={[AppStyles.modalButton, { backgroundColor: '#007bff', marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                            <Text style={AppStyles.modalButtonText}>Update Announcement</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelEdit} style={[AppStyles.modalButton, { backgroundColor: colors.mediumGray, marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                            <Text style={AppStyles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleAddAnnouncement} style={[AppStyles.modalButton, { backgroundColor: colors.bottleGreen, marginHorizontal: 5 }]}> {/* Replaced Button with TouchableOpacity and mapped styles */}
                        <Text style={AppStyles.modalButtonText}>Send Announcement</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={AppStyles.profileDetailsContainer}> {/* Replaced styles.listCard with AppStyles.profileDetailsContainer */}
                <Text style={AppStyles.profileSectionTitle}>All Announcements</Text> {/* Replaced styles.listTitle with AppStyles.profileSectionTitle */}
                <FlatList
                    data={announcements}
                    renderItem={renderAnnouncementItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={AppStyles.modalText}>No announcements sent yet.</Text>}
                />
            </View>
        </ScrollView>
    );
};

// Removed the local styles object as requested.
// Styles are now imported from AppStyles.

export default AnnouncementsScreen;
