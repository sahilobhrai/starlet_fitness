import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Modal,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import Notification from '../components/Notification';
import {
    generateSlots,
    getWeekSlots,
    blockSlot,
    blockSlotRange,
    setDayOff,
} from '../api/index';

const { width } = Dimensions.get('window');

interface SlotManagementScreenProps {
    navigation: any;
}

interface SlotData {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    customer_name?: string;
    customer_phone?: string;
}

interface DayData {
    date: string;
    day_name: string;
    is_off: boolean;
    slots: SlotData[];
}

interface WeekData {
    branch_name?: string;
    days: DayData[];
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getDate() + '/' + (d.getMonth() + 1);
};

const formatDateFull = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()];
};

const toYMD = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const formatTimeDisplay = (time: string): string => {
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${m} ${ampm}`;
};

const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let h = 5; h <= 22; h++) {
        times.push(`${String(h).padStart(2, '0')}:00`);
        times.push(`${String(h).padStart(2, '0')}:30`);
    }
    return times;
};

const SLOT_COLORS = {
    available: '#4CAF50',
    blocked: '#757575',
    booked: '#1E88E5',
};

const SlotManagementScreen = ({ navigation }: SlotManagementScreenProps) => {
    const [branchId, setBranchId] = useState<string | null>(null);
    const [weekData, setWeekData] = useState<WeekData | null>(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
    const [currentWeekStart, setCurrentWeekStart] = useState<string>(toYMD(getMonday(new Date())));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
        isVisible: boolean;
    }>({ message: '', type: 'info', isVisible: false });

    // Block Range Modal
    const [showBlockRangeModal, setShowBlockRangeModal] = useState<boolean>(false);
    const [blockRangeStartTime, setBlockRangeStartTime] = useState<string>('09:00');
    const [blockRangeEndTime, setBlockRangeEndTime] = useState<string>('17:00');
    const [blockRangeAction, setBlockRangeAction] = useState<'block' | 'unblock'>('block');

    // Customer Info Modal
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
    const [selectedBookedSlot, setSelectedBookedSlot] = useState<SlotData | null>(null);

    // Day Off Confirm Modal
    const [showDayOffConfirm, setShowDayOffConfirm] = useState<boolean>(false);
    const [dayOffTarget, setDayOffTarget] = useState<boolean>(false);

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type, isVisible: true });
    };

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, isVisible: false }));
    };

    // Load branch ID from AsyncStorage
    useEffect(() => {
        const loadBranch = async () => {
            const branch = await AsyncStorage.getItem('userBranch');
            if (branch) {
                setBranchId(branch);
            } else {
                showNotification('Branch not found. Please re-login.', 'error');
                setIsLoading(false);
            }
        };
        loadBranch();
    }, []);

    // Fetch week data when branchId or currentWeekStart changes
    const fetchWeekData = useCallback(async () => {
        if (!branchId) return;
        setIsLoading(true);
        try {
            // Generate slots first (idempotent on backend) - generate 14 days to cover next 2 weeks
            await generateSlots(branchId, 14);

            // Then fetch the week
            const resp = await getWeekSlots(branchId, currentWeekStart);
            if (resp && !resp.error) {
                setWeekData(resp);
                // If selectedDayIndex is out of bounds, reset
                if (resp.days && selectedDayIndex >= resp.days.length) {
                    setSelectedDayIndex(0);
                }
            } else {
                showNotification(resp?.error || 'Failed to load slots.', 'error');
            }
        } catch (error) {
            console.error('Fetch week data error:', error);
            showNotification('Error loading slot data.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [branchId, currentWeekStart]);

    useEffect(() => {
        if (branchId) {
            fetchWeekData();
        }
    }, [branchId, currentWeekStart, fetchWeekData]);

    // Navigate weeks
    const goToPreviousWeek = () => {
        const d = new Date(currentWeekStart + 'T00:00:00');
        d.setDate(d.getDate() - 7);
        setCurrentWeekStart(toYMD(d));
        setSelectedDayIndex(0);
    };

    const goToNextWeek = () => {
        const d = new Date(currentWeekStart + 'T00:00:00');
        d.setDate(d.getDate() + 7);
        setCurrentWeekStart(toYMD(d));
        setSelectedDayIndex(0);
    };

    // Get current day data
    const currentDay: DayData | null =
        weekData?.days && weekData.days[selectedDayIndex] ? weekData.days[selectedDayIndex] : null;

    // Split slots into morning and evening
    const morningSlots = currentDay?.slots?.filter((s) => {
        const hour = parseInt(s.start_time.split(':')[0], 10);
        return hour < 12;
    }) || [];

    const eveningSlots = currentDay?.slots?.filter((s) => {
        const hour = parseInt(s.start_time.split(':')[0], 10);
        return hour >= 12;
    }) || [];

    // Handle slot tap
    const handleSlotTap = async (slot: SlotData) => {
        const status = slot.status?.toLowerCase();
        if (status === 'booked') {
            setSelectedBookedSlot(slot);
            setShowCustomerModal(true);
            return;
        }

        const action = status === 'available' ? 'block' : 'unblock';
        try {
            const resp = await blockSlot(slot.id, action);
            if (resp && !resp.error) {
                showNotification(
                    `Slot ${formatTimeDisplay(slot.start_time)} ${action === 'block' ? 'blocked' : 'unblocked'}.`,
                    'success'
                );
                fetchWeekData();
            } else {
                showNotification(resp?.error || `Failed to ${action} slot.`, 'error');
            }
        } catch (error) {
            showNotification(`Error ${action}ing slot.`, 'error');
        }
    };

    // Handle day off toggle
    const handleDayOffToggle = () => {
        if (!currentDay) return;
        setDayOffTarget(!currentDay.is_off);
        setShowDayOffConfirm(true);
    };

    const confirmDayOff = async () => {
        if (!branchId || !currentDay) return;
        setShowDayOffConfirm(false);
        try {
            const resp = await setDayOff(branchId, currentDay.date, dayOffTarget);
            if (resp && !resp.error) {
                showNotification(
                    dayOffTarget ? 'Day marked as off.' : 'Day marked as working.',
                    'success'
                );
                fetchWeekData();
            } else {
                showNotification(resp?.error || 'Failed to update day off status.', 'error');
            }
        } catch (error) {
            showNotification('Error updating day off status.', 'error');
        }
    };

    // Handle block range
    const handleBlockRange = async () => {
        if (!branchId || !currentDay) return;
        setShowBlockRangeModal(false);
        try {
            const resp = await blockSlotRange(
                branchId,
                currentDay.date,
                blockRangeStartTime,
                blockRangeEndTime,
                blockRangeAction
            );
            if (resp && !resp.error) {
                showNotification(
                    `Slots ${blockRangeAction === 'block' ? 'blocked' : 'unblocked'} from ${formatTimeDisplay(blockRangeStartTime)} to ${formatTimeDisplay(blockRangeEndTime)}.`,
                    'success'
                );
                fetchWeekData();
            } else {
                showNotification(resp?.error || 'Failed to update slot range.', 'error');
            }
        } catch (error) {
            showNotification('Error updating slot range.', 'error');
        }
    };

    // Week range display
    const weekEndDate = (): string => {
        const d = new Date(currentWeekStart + 'T00:00:00');
        d.setDate(d.getDate() + 6);
        return toYMD(d);
    };

    const renderSlotChip = (slot: SlotData) => {
        const status = slot.status?.toLowerCase() || 'available';
        let bgColor = SLOT_COLORS.available;
        let icon = 'check-circle';
        if (status === 'blocked') {
            bgColor = SLOT_COLORS.blocked;
            icon = 'ban';
        } else if (status === 'booked') {
            bgColor = SLOT_COLORS.booked;
            icon = 'user';
        }

        return (
            <TouchableOpacity
                key={slot.id}
                style={[styles.slotChip, { backgroundColor: bgColor }]}
                onPress={() => handleSlotTap(slot)}
                activeOpacity={0.7}
            >
                <Icon name={icon} size={12} color="#fff" style={styles.slotChipIcon} />
                <Text style={styles.slotChipText}>{formatTimeDisplay(slot.start_time)}</Text>
            </TouchableOpacity>
        );
    };

    const renderSlotSection = (title: string, slots: SlotData[], icon: string) => {
        if (slots.length === 0) return null;
        return (
            <View style={styles.slotSection}>
                <View style={styles.slotSectionHeader}>
                    <Icon name={icon} size={16} color={colors.lightGray} />
                    <Text style={styles.slotSectionTitle}>{title}</Text>
                    <Text style={styles.slotSectionCount}>{slots.length} slots</Text>
                </View>
                <View style={styles.slotGrid}>
                    {slots.map((slot) => renderSlotChip(slot))}
                </View>
            </View>
        );
    };

    const timeOptions = generateTimeOptions();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {weekData?.branch_name || 'Slot Management'}
                </Text>
                <View style={styles.weekNav}>
                    <TouchableOpacity onPress={goToPreviousWeek} style={styles.weekArrow}>
                        <Icon name="chevron-left" size={18} color={colors.lightGray} />
                    </TouchableOpacity>
                    <Text style={styles.weekRange}>
                        {formatDateFull(currentWeekStart)} - {formatDateFull(weekEndDate())}
                    </Text>
                    <TouchableOpacity onPress={goToNextWeek} style={styles.weekArrow}>
                        <Icon name="chevron-right" size={18} color={colors.lightGray} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Day Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.dayTabsContainer}
                contentContainerStyle={styles.dayTabsContent}
            >
                {weekData?.days?.map((day, index) => {
                    const isSelected = index === selectedDayIndex;
                    const dayLabel = DAY_NAMES[index] || day.day_name?.substring(0, 3) || '';
                    return (
                        <TouchableOpacity
                            key={day.date}
                            style={[styles.dayTab, isSelected && styles.dayTabSelected]}
                            onPress={() => setSelectedDayIndex(index)}
                        >
                            <Text style={[styles.dayTabName, isSelected && styles.dayTabNameSelected]}>
                                {dayLabel}
                            </Text>
                            <Text style={[styles.dayTabDate, isSelected && styles.dayTabDateSelected]}>
                                {formatDate(day.date)}
                            </Text>
                            {day.is_off && <View style={styles.dayOffDot} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Main Content */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.lightGray} />
                    <Text style={styles.loadingText}>Loading slots...</Text>
                </View>
            ) : currentDay ? (
                <ScrollView style={styles.dayContent} contentContainerStyle={styles.dayContentContainer}>
                    {/* Day Controls */}
                    <View style={styles.dayControls}>
                        <TouchableOpacity
                            style={[styles.dayOffToggle, currentDay.is_off && styles.dayOffToggleActive]}
                            onPress={handleDayOffToggle}
                        >
                            <Icon
                                name={currentDay.is_off ? 'toggle-on' : 'toggle-off'}
                                size={22}
                                color={currentDay.is_off ? '#F44336' : colors.lightGray}
                            />
                            <Text style={styles.dayOffToggleText}>
                                {currentDay.is_off ? 'Day Off' : 'Working Day'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.blockRangeButton}
                            onPress={() => setShowBlockRangeModal(true)}
                        >
                            <Icon name="clock-o" size={16} color="#fff" />
                            <Text style={styles.blockRangeButtonText}>Block Range</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Day Content */}
                    {currentDay.is_off ? (
                        <View style={styles.dayOffMessage}>
                            <Icon name="calendar-times-o" size={50} color={colors.mediumGray} />
                            <Text style={styles.dayOffText}>DAY OFF</Text>
                            <Text style={styles.dayOffSubtext}>No slots available for this day</Text>
                        </View>
                    ) : (
                        <>
                            {renderSlotSection('Morning', morningSlots, 'sun-o')}
                            {renderSlotSection('Evening', eveningSlots, 'moon-o')}
                            {morningSlots.length === 0 && eveningSlots.length === 0 && (
                                <View style={styles.noSlotsMessage}>
                                    <Icon name="info-circle" size={30} color={colors.mediumGray} />
                                    <Text style={styles.noSlotsText}>No slots configured for this day</Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* Legend */}
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: SLOT_COLORS.available }]} />
                            <Text style={styles.legendText}>Available</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: SLOT_COLORS.blocked }]} />
                            <Text style={styles.legendText}>Blocked</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: SLOT_COLORS.booked }]} />
                            <Text style={styles.legendText}>Booked</Text>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.loadingContainer}>
                    <Icon name="calendar-o" size={40} color={colors.mediumGray} />
                    <Text style={styles.loadingText}>No data available</Text>
                </View>
            )}

            {/* Block Range Modal */}
            <Modal
                visible={showBlockRangeModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowBlockRangeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Block/Unblock Time Range</Text>
                        {currentDay && (
                            <Text style={styles.modalSubtitle}>
                                {currentDay.day_name} - {formatDateFull(currentDay.date)}
                            </Text>
                        )}

                        {/* Action Toggle */}
                        <View style={styles.actionToggle}>
                            <TouchableOpacity
                                style={[
                                    styles.actionToggleBtn,
                                    blockRangeAction === 'block' && styles.actionToggleBtnActive,
                                ]}
                                onPress={() => setBlockRangeAction('block')}
                            >
                                <Text
                                    style={[
                                        styles.actionToggleText,
                                        blockRangeAction === 'block' && styles.actionToggleTextActive,
                                    ]}
                                >
                                    Block
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.actionToggleBtn,
                                    blockRangeAction === 'unblock' && styles.actionToggleBtnActiveGreen,
                                ]}
                                onPress={() => setBlockRangeAction('unblock')}
                            >
                                <Text
                                    style={[
                                        styles.actionToggleText,
                                        blockRangeAction === 'unblock' && styles.actionToggleTextActive,
                                    ]}
                                >
                                    Unblock
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Start Time */}
                        <Text style={styles.timeLabel}>Start Time</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.timePickerScroll}
                        >
                            {timeOptions.map((time) => (
                                <TouchableOpacity
                                    key={'start-' + time}
                                    style={[
                                        styles.timeChip,
                                        blockRangeStartTime === time && styles.timeChipSelected,
                                    ]}
                                    onPress={() => setBlockRangeStartTime(time)}
                                >
                                    <Text
                                        style={[
                                            styles.timeChipText,
                                            blockRangeStartTime === time && styles.timeChipTextSelected,
                                        ]}
                                    >
                                        {formatTimeDisplay(time)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* End Time */}
                        <Text style={styles.timeLabel}>End Time</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.timePickerScroll}
                        >
                            {timeOptions.map((time) => (
                                <TouchableOpacity
                                    key={'end-' + time}
                                    style={[
                                        styles.timeChip,
                                        blockRangeEndTime === time && styles.timeChipSelected,
                                    ]}
                                    onPress={() => setBlockRangeEndTime(time)}
                                >
                                    <Text
                                        style={[
                                            styles.timeChipText,
                                            blockRangeEndTime === time && styles.timeChipTextSelected,
                                        ]}
                                    >
                                        {formatTimeDisplay(time)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Modal Buttons */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButtonCancel}
                                onPress={() => setShowBlockRangeModal(false)}
                            >
                                <Text style={styles.modalButtonCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButtonConfirm,
                                    blockRangeAction === 'block'
                                        ? { backgroundColor: '#F44336' }
                                        : { backgroundColor: '#4CAF50' },
                                ]}
                                onPress={handleBlockRange}
                            >
                                <Text style={styles.modalButtonConfirmText}>
                                    {blockRangeAction === 'block' ? 'Block Slots' : 'Unblock Slots'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Customer Info Modal */}
            <Modal
                visible={showCustomerModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCustomerModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainerSmall}>
                        <Icon name="user-circle" size={50} color={SLOT_COLORS.booked} />
                        <Text style={styles.modalTitle}>Booking Details</Text>
                        {selectedBookedSlot && (
                            <>
                                <Text style={styles.customerInfoLabel}>Time</Text>
                                <Text style={styles.customerInfoValue}>
                                    {formatTimeDisplay(selectedBookedSlot.start_time)} -{' '}
                                    {formatTimeDisplay(selectedBookedSlot.end_time)}
                                </Text>
                                <Text style={styles.customerInfoLabel}>Customer</Text>
                                <Text style={styles.customerInfoValue}>
                                    {selectedBookedSlot.customer_name || 'N/A'}
                                </Text>
                                <Text style={styles.customerInfoLabel}>Phone</Text>
                                <Text style={styles.customerInfoValue}>
                                    {selectedBookedSlot.customer_phone || 'N/A'}
                                </Text>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowCustomerModal(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Day Off Confirmation Modal */}
            <Modal
                visible={showDayOffConfirm}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDayOffConfirm(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainerSmall}>
                        <Icon
                            name={dayOffTarget ? 'calendar-times-o' : 'calendar-check-o'}
                            size={50}
                            color={dayOffTarget ? '#F44336' : '#4CAF50'}
                        />
                        <Text style={styles.modalTitle}>
                            {dayOffTarget ? 'Mark Day Off?' : 'Mark as Working?'}
                        </Text>
                        <Text style={styles.modalSubtitle}>
                            {dayOffTarget
                                ? 'All available slots for this day will be blocked.'
                                : 'This day will be reopened for bookings.'}
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButtonCancel}
                                onPress={() => setShowDayOffConfirm(false)}
                            >
                                <Text style={styles.modalButtonCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButtonConfirm,
                                    dayOffTarget
                                        ? { backgroundColor: '#F44336' }
                                        : { backgroundColor: '#4CAF50' },
                                ]}
                                onPress={confirmDayOff}
                            >
                                <Text style={styles.modalButtonConfirmText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
                isVisible={notification.isVisible}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },

    // Header
    header: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.lightGray,
        textAlign: 'center',
        marginBottom: 8,
    },
    weekNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekArrow: {
        padding: 10,
    },
    weekRange: {
        fontSize: 15,
        color: colors.lightGray,
        marginHorizontal: 10,
        fontWeight: '500',
    },

    // Day Tabs
    dayTabsContainer: {
        maxHeight: 75,
    },
    dayTabsContent: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    dayTab: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginHorizontal: 4,
        borderRadius: 10,
        backgroundColor: '#1a1a1a',
        minWidth: 55,
    },
    dayTabSelected: {
        backgroundColor: '#ff0000',
    },
    dayTabName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.mediumGray,
    },
    dayTabNameSelected: {
        color: '#fff',
    },
    dayTabDate: {
        fontSize: 11,
        color: colors.mediumGray,
        marginTop: 2,
    },
    dayTabDateSelected: {
        color: '#fff',
    },
    dayOffDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F44336',
        marginTop: 3,
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.mediumGray,
        fontSize: 14,
        marginTop: 10,
    },

    // Day Content
    dayContent: {
        flex: 1,
    },
    dayContentContainer: {
        paddingBottom: 20,
    },

    // Day Controls
    dayControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    dayOffToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
    },
    dayOffToggleActive: {
        backgroundColor: '#2a1515',
    },
    dayOffToggleText: {
        color: colors.lightGray,
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
    },
    blockRangeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    blockRangeButtonText: {
        color: '#fff',
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '500',
    },

    // Day Off Message
    dayOffMessage: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    dayOffText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.mediumGray,
        marginTop: 15,
    },
    dayOffSubtext: {
        fontSize: 14,
        color: colors.mediumGray,
        marginTop: 5,
    },

    // Slot Sections
    slotSection: {
        marginHorizontal: 15,
        marginTop: 10,
    },
    slotSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    slotSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.lightGray,
        marginLeft: 8,
        flex: 1,
    },
    slotSectionCount: {
        fontSize: 12,
        color: colors.mediumGray,
    },
    slotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    // Slot Chip
    slotChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        margin: 4,
        width: (width - 54) / 3,
        justifyContent: 'center',
    },
    slotChipIcon: {
        marginRight: 4,
    },
    slotChipText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },

    // No Slots
    noSlotsMessage: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noSlotsText: {
        color: colors.mediumGray,
        fontSize: 14,
        marginTop: 10,
    },

    // Legend
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    legendText: {
        color: colors.mediumGray,
        fontSize: 12,
    },

    // Modal Common
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        width: width - 40,
        maxHeight: '80%',
    },
    modalContainerSmall: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 25,
        width: width - 60,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.lightGray,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 14,
        color: colors.mediumGray,
        textAlign: 'center',
        marginBottom: 15,
    },

    // Action Toggle
    actionToggle: {
        flexDirection: 'row',
        backgroundColor: '#222',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    actionToggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    actionToggleBtnActive: {
        backgroundColor: '#F44336',
    },
    actionToggleBtnActiveGreen: {
        backgroundColor: '#4CAF50',
    },
    actionToggleText: {
        color: colors.mediumGray,
        fontSize: 14,
        fontWeight: '600',
    },
    actionToggleTextActive: {
        color: '#fff',
    },

    // Time Picker
    timeLabel: {
        fontSize: 14,
        color: colors.lightGray,
        marginBottom: 8,
        fontWeight: '500',
    },
    timePickerScroll: {
        maxHeight: 45,
        marginBottom: 15,
    },
    timeChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#222',
        marginRight: 8,
    },
    timeChipSelected: {
        backgroundColor: '#ff0000',
    },
    timeChipText: {
        color: colors.mediumGray,
        fontSize: 12,
        fontWeight: '500',
    },
    timeChipTextSelected: {
        color: '#fff',
    },

    // Modal Buttons
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    modalButtonCancel: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
        marginRight: 8,
    },
    modalButtonCancelText: {
        color: colors.lightGray,
        fontSize: 14,
        fontWeight: '600',
    },
    modalButtonConfirm: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    modalButtonConfirmText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Customer Info
    customerInfoLabel: {
        fontSize: 12,
        color: colors.mediumGray,
        marginTop: 10,
    },
    customerInfoValue: {
        fontSize: 16,
        color: colors.lightGray,
        fontWeight: '500',
        marginTop: 2,
    },

    // Modal Close Button
    modalCloseButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    modalCloseButtonText: {
        color: colors.lightGray,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default SlotManagementScreen;
