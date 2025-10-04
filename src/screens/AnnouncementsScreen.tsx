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
        Alert.alert(
            'Delete Announcement',
            'Are you sure you want to delete this announcement? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setAnnouncements(announcements.filter(announcement => announcement.id !== id));
                        Alert.alert('Success', 'Announcement deleted successfully!');
                    }
                }
            ]
        );
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
        <View style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
                <View style={styles.announcementTitleSection}>
                    <Text style={styles.announcementTitle}>{item.title}</Text>
                    <View style={styles.announcementBadge}>
                        <Text style={styles.announcementBadgeText}>
                            {item.sentTo === 'all' ? '👥 ALL' : item.sentTo === 'trainers' ? '🏋️ TRAINERS' : '💪 CUSTOMERS'}
                        </Text>
                    </View>
                </View>
                <View style={styles.announcementIdBadge}>
                    <Text style={styles.announcementIdText}>ID: {item.id}</Text>
                </View>
            </View>

            <View style={styles.announcementContent}>
                <Text style={styles.announcementMessage}>{item.message}</Text>
            </View>

            <View style={styles.announcementFooter}>
                <View style={styles.announcementMeta}>
                    <Text style={styles.announcementTimestamp}>📅 {item.timestamp}</Text>
                </View>

                <View style={styles.announcementActions}>
                    <TouchableOpacity
                        onPress={() => handleEditAnnouncement(item)}
                        style={styles.editButton}
                    >
                        <Text style={styles.editButtonText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDeleteAnnouncement(item.id)}
                        style={styles.deleteButton}
                    >
                        <Text style={styles.deleteButtonText}>🗑️ Remove</Text>
                    </TouchableOpacity>
                </View>
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
                    <Text style={styles.pageTitle}>📢 Announcements</Text>
                    <Text style={styles.pageSubtitle}>Create and manage announcements for your fitness community</Text>
                </View>

                {/* Add/Edit Form Section */}
                <View style={styles.formSection}>
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>
                            {editingAnnouncement ? '✏️ Edit Announcement' : '➕ Create New Announcement'}
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Announcement Title</Text>
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter announcement title"
                                placeholderTextColor={colors.mediumGray}
                                value={newAnnouncementTitle}
                                onChangeText={setNewAnnouncementTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Message Content</Text>
                            <TextInput
                                style={styles.formTextarea}
                                placeholder="Enter your announcement message"
                                placeholderTextColor={colors.mediumGray}
                                value={newAnnouncementMessage}
                                onChangeText={setNewAnnouncementMessage}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Send To</Text>
                            <View style={styles.targetButtons}>
                                <TouchableOpacity
                                    style={[styles.targetButton, newAnnouncementTarget === 'all' && styles.targetButtonActive]}
                                    onPress={() => setNewAnnouncementTarget('all')}
                                >
                                    <Text style={[styles.targetButtonText, newAnnouncementTarget === 'all' && styles.targetButtonTextActive]}>👥 All Users</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.targetButton, newAnnouncementTarget === 'trainers' && styles.targetButtonActive]}
                                    onPress={() => setNewAnnouncementTarget('trainers')}
                                >
                                    <Text style={[styles.targetButtonText, newAnnouncementTarget === 'trainers' && styles.targetButtonTextActive]}>🏋️ Trainers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.targetButton, newAnnouncementTarget === 'customers' && styles.targetButtonActive]}
                                    onPress={() => setNewAnnouncementTarget('customers')}
                                >
                                    <Text style={[styles.targetButtonText, newAnnouncementTarget === 'customers' && styles.targetButtonTextActive]}>💪 Customers</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formActions}>
                            {editingAnnouncement ? (
                                <>
                                    <TouchableOpacity
                                        onPress={handleUpdateAnnouncement}
                                        style={styles.updateButton}
                                    >
                                        <Text style={styles.updateButtonText}>Update Announcement</Text>
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
                                    onPress={handleAddAnnouncement}
                                    style={styles.addButton}
                                >
                                    <Text style={styles.addButtonText}>📤 Send Announcement</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Announcements List Section */}
                <View style={styles.listSection}>
                    <View style={styles.listHeader}>
                        <Text style={styles.listTitle}>All Announcements ({announcements.length})</Text>
                    </View>

                    {announcements.length > 0 ? (
                        <FlatList
                            data={announcements}
                            renderItem={renderAnnouncementItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyStateIcon}>
                                <Text style={styles.emptyStateIconText}>📢</Text>
                            </View>
                            <Text style={styles.emptyStateText}>No Announcements Yet</Text>
                            <Text style={styles.emptyStateSubtext}>Start communicating with your fitness community by creating your first announcement using the form above.</Text>
                            <View style={styles.emptyStateTip}>
                                <Text style={styles.emptyStateTipText}>💡 Tip: Use announcements to share important updates, schedule changes, or motivational messages</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

// Define comprehensive styles matching ManageBranchesScreen pattern
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
    formTextarea: {
        backgroundColor: colors.black,
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.lightGray,
        height: 100,
        textAlignVertical: 'top',
    },

    // Target Selection Buttons
    targetButtons: {
        flexDirection: 'row' as const,
        gap: 10,
    },
    targetButton: {
        flex: 1,
        backgroundColor: colors.darkGray,
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: 'center' as const,
    },
    targetButtonActive: {
        backgroundColor: colors.bottleGreen,
        borderColor: colors.bottleGreen,
    },
    targetButtonText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.lightGray,
        textAlign: 'center' as const,
    },
    targetButtonTextActive: {
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
    emptyStateIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.bottleGreen + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyStateIconText: {
        fontSize: 40,
        color: colors.bottleGreen,
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
        lineHeight: 20,
    },
    emptyStateTip: {
        backgroundColor: colors.bottleGreen + '20',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 15,
    },
    emptyStateTipText: {
        fontSize: 12,
        color: colors.bottleGreen,
        fontWeight: 'bold',
        textAlign: 'center' as const,
    },

    // Announcement Card Styles
    announcementCard: {
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
    },
    announcementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    announcementTitleSection: {
        flex: 1,
    },
    announcementTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.lightGray,
        marginBottom: 8,
    },
    announcementBadge: {
        backgroundColor: colors.bottleGreen + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    announcementBadgeText: {
        fontSize: 12,
        color: colors.bottleGreen,
        fontWeight: 'bold',
    },
    announcementIdBadge: {
        backgroundColor: colors.lightGray + '10',
        borderRadius: 8,
        padding: 8,
    },
    announcementIdText: {
        fontSize: 12,
        color: colors.lightGray,
        fontWeight: 'bold',
    },
    announcementContent: {
        backgroundColor: colors.black + '40',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    announcementMessage: {
        fontSize: 16,
        color: colors.lightGray,
        marginBottom: 6,
        fontWeight: '600',
        lineHeight: 22,
    },
    announcementFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.mediumGray + '30',
        paddingTop: 12,
    },
    announcementMeta: {
        flex: 1,
    },
    announcementTimestamp: {
        fontSize: 14,
        color: colors.mediumGray,
    },
    announcementActions: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        backgroundColor: '#ffc107',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    editButtonText: {
        color: colors.black,
        fontSize: 14,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: colors.red,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: colors.lightGray,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default AnnouncementsScreen;
