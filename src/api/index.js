import apiConfig from './apiConfig';
import { API_URLS } from './urls';

// ==================== AUTHENTICATION ====================
export const sendOtp = (phone) => {
    return apiConfig.postApiUrl(API_URLS.SEND_OTP, { phone });
}

export const resendOtp = (phone) => {
    return apiConfig.postApiUrl(API_URLS.RESEND_OTP, { phone });
}

export const verifyOtp = (phone, otp) => {
    return apiConfig.postApiUrl(API_URLS.VERIFY_OTP, { phone, otp });
}

// ==================== SLOT MANAGEMENT ====================
// Note: Backend has AllowAny permission, so no auth needed
export const generateSlots = (branchId, daysAhead = 7) => {
    return apiConfig.postApiUrl(API_URLS.GENERATE_SLOTS, { branch_id: branchId, days_ahead: daysAhead }, false);
}

export const getSlots = (branchId, date) => {
    return apiConfig.getApiUrl(API_URLS.GET_SLOTS + '?branch_id=' + branchId + '&date=' + date, null, false);
}

export const getWeekSlots = (branchId, startDate) => {
    return apiConfig.getApiUrl(API_URLS.GET_WEEK_SLOTS + '?branch_id=' + branchId + '&start_date=' + startDate, null, false);
}

export const blockSlot = (slotId, action) => {
    return apiConfig.postApiUrl(API_URLS.BLOCK_SLOT, { slot_id: slotId, action: action }, false);
}

export const blockSlotRange = (branchId, date, startTime, endTime, action) => {
    return apiConfig.postApiUrl(API_URLS.BLOCK_SLOT_RANGE, {
        branch_id: branchId,
        date: date,
        start_time: startTime,
        end_time: endTime,
        action: action
    }, false);
}

export const setDayOff = (branchId, date, isOff, reason = '') => {
    return apiConfig.postApiUrl(API_URLS.SET_DAY_OFF, {
        branch_id: branchId,
        date: date,
        is_off: isOff,
        reason: reason
    }, false);
}

export const getSlotConfig = (branchId) => {
    return apiConfig.getApiUrl(API_URLS.GET_SLOT_CONFIG + '?branch_id=' + branchId, null, false);
}

export const updateSlotConfig = (branchId, weekday, config) => {
    return apiConfig.postApiUrl(API_URLS.UPDATE_SLOT_CONFIG, {
        branch_id: branchId,
        weekday: weekday,
        ...config
    }, false);
}

// ==================== CLIENT APIs ====================
// Note: Backend has AllowAny permission, so no auth needed
export const getClientProfile = (clientId) => {
    return apiConfig.getApiUrl(API_URLS.CLIENT_PROFILE + '?client_id=' + clientId, null, false);
}

export const updateClientProfile = (clientId, data) => {
    return apiConfig.postApiUrl(API_URLS.UPDATE_CLIENT_PROFILE, { client_id: clientId, ...data }, false);
}

export const getClientAvailableSlots = (branchId, date) => {
    return apiConfig.getApiUrl(API_URLS.CLIENT_AVAILABLE_SLOTS + '?branch_id=' + branchId + '&date=' + date, null, false);
}

export const getClientSessions = (clientId, status = null) => {
    let url = API_URLS.CLIENT_SESSIONS + '?client_id=' + clientId;
    if (status) {
        url += '&status=' + status;
    }
    return apiConfig.getApiUrl(url, null, false);
}

export const bookSession = (clientId, slotId, trainerId = null, notes = '') => {
    return apiConfig.postApiUrl(API_URLS.BOOK_SESSION, {
        client_id: clientId,
        slot_id: slotId,
        trainer_id: trainerId,
        notes: notes
    }, false);
}

export const cancelSession = (sessionId, clientId) => {
    return apiConfig.postApiUrl(API_URLS.CANCEL_SESSION, { session_id: sessionId, client_id: clientId }, false);
}

export const generateSessionQR = (sessionId, clientId) => {
    return apiConfig.postApiUrl(API_URLS.GENERATE_SESSION_QR, { session_id: sessionId, client_id: clientId }, false);
}

// ==================== TRAINER APIs ====================
// Note: Backend has AllowAny permission, so no auth needed
export const getTrainerDashboard = (trainerId) => {
    return apiConfig.getApiUrl(API_URLS.TRAINER_DASHBOARD + '?trainer_id=' + trainerId, null, false);
}

export const getTrainerAssignedSessions = (trainerId) => {
    return apiConfig.getApiUrl(API_URLS.TRAINER_ASSIGNED_SESSIONS + '?trainer_id=' + trainerId, null, false);
}

export const getTrainerUpcomingSessions = (trainerId) => {
    return apiConfig.getApiUrl(API_URLS.TRAINER_UPCOMING_SESSIONS + '?trainer_id=' + trainerId, null, false);
}

export const getTrainerEarnings = (trainerId, period = 'all') => {
    return apiConfig.getApiUrl(API_URLS.TRAINER_EARNINGS + '?trainer_id=' + trainerId + '&period=' + period, null, false);
}

export const startSession = (sessionId) => {
    return apiConfig.postApiUrl(API_URLS.START_SESSION, { session_id: sessionId }, false);
}

export const endSession = (sessionId, sessionAmount = 500) => {
    return apiConfig.postApiUrl(API_URLS.END_SESSION, { session_id: sessionId, session_amount: sessionAmount }, false);
}

export const scanSessionQR = (token, trainerId) => {
    return apiConfig.postApiUrl(API_URLS.SCAN_SESSION_QR, { token: token, trainer_id: trainerId }, false);
}

export const getClientBca = (clientId) => {
    return apiConfig.getApiUrl(API_URLS.GET_CLIENT_BCA + '?client_id=' + clientId, null, false);
}

export const syncClientBca = (clientId) => {
    return apiConfig.postApiUrl(API_URLS.SYNC_CLIENT_BCA, { client_id: clientId }, false);
}

export const previewBca = (phone) => {
    return apiConfig.postApiUrl(API_URLS.PREVIEW_BCA, { phone: phone }, false);
}

export const updateClientMeasurements = (clientId, measurements) => {
    return apiConfig.postApiUrl(API_URLS.UPDATE_MEASUREMENTS, { client_id: clientId, ...measurements }, false);
}

// ==================== MANAGER APIs ====================
// Note: Backend has AllowAny permission, so no auth needed
export const getManagerDashboard = (branchId) => {
    return apiConfig.getApiUrl(API_URLS.MANAGER_DASHBOARD + '?branch_id=' + branchId, null, false);
}

export const getBranchSessions = (branchId, status = null, dateFrom = null, dateTo = null) => {
    let url = API_URLS.BRANCH_SESSIONS + '?branch_id=' + branchId;
    if (status) url += '&status=' + status;
    if (dateFrom) url += '&date_from=' + dateFrom;
    if (dateTo) url += '&date_to=' + dateTo;
    return apiConfig.getApiUrl(url, null, false);
}

export const getBranchTrainers = (branchId) => {
    return apiConfig.getApiUrl(API_URLS.BRANCH_TRAINERS + '?branch_id=' + branchId, null, false);
}

export const getBranchClients = (branchId) => {
    return apiConfig.getApiUrl(API_URLS.BRANCH_CLIENTS + '?branch_id=' + branchId, null, false);
}

export const enrollClient = (branchId, name, email, phone, heightCm = null, weightKg = null) => {
    return apiConfig.postApiUrl(API_URLS.ENROLL_CLIENT, {
        branch_id: branchId,
        name: name,
        email: email,
        phone: phone,
        height_cm: heightCm,
        weight_kg: weightKg
    }, false);
}

export const enrollTrainer = (branchId, name, email, phone, isPartner = false, partnerId = null) => {
    return apiConfig.postApiUrl(API_URLS.ENROLL_TRAINER, {
        branch_id: branchId,
        name: name,
        email: email,
        phone: phone,
        is_partner: isPartner,
        partner_id: partnerId
    }, false);
}

export const getTrainerSessions = (trainerId, status = null) => {
    let url = API_URLS.TRAINER_SESSIONS + '?trainer_id=' + trainerId;
    if (status) url += '&status=' + status;
    return apiConfig.getApiUrl(url, null, false);
}

// ==================== BRANCH CRUD APIs (Owner) ====================
// Note: Backend has AllowAny permission, so no auth needed
export const getBranches = () => {
    return apiConfig.getApiUrl(API_URLS.GET_BRANCHES, null, false);
}

export const createBranch = (name, location, city, state, zipCode = '') => {
    return apiConfig.postApiUrl(API_URLS.CREATE_BRANCH, {
        name: name,
        location: location,
        city: city,
        state: state,
        zip_code: zipCode
    }, false);
}

export const updateBranch = (branchId, data) => {
    return apiConfig.postApiUrl(API_URLS.UPDATE_BRANCH, { branch_id: branchId, ...data }, false);
}

export const deleteBranch = (branchId) => {
    return apiConfig.deleteApiUrl(API_URLS.DELETE_BRANCH + '?branch_id=' + branchId, null, false);
}

// ==================== INVOICE APIs ====================
// Note: Backend has AllowAny permission, so no auth needed
export const getInvoices = (branchId = null, customerId = null) => {
    let url = API_URLS.GET_INVOICES + '?';
    if (branchId) url += 'branch_id=' + branchId + '&';
    if (customerId) url += 'customer_id=' + customerId;
    return apiConfig.getApiUrl(url, null, false);
}

export const createInvoice = (customerId, branchId, items, gstPercent = 18, notes = '') => {
    return apiConfig.postApiUrl(API_URLS.CREATE_INVOICE, {
        customer_id: customerId,
        branch_id: branchId,
        items: items,
        gst_percent: gstPercent,
        notes: notes
    }, false);
}

// ==================== ANNOUNCEMENT APIs ====================
// Note: Backend has AllowAny permission, so no auth needed
export const getAnnouncements = (branchId = null, audience = null) => {
    let url = API_URLS.GET_ANNOUNCEMENTS + '?';
    if (branchId) url += 'branch_id=' + branchId + '&';
    if (audience) url += 'audience=' + audience;
    return apiConfig.getApiUrl(url, null, false);
}

export const createAnnouncement = (title, message, audience = 'ALL', branchId = null, createdById = null) => {
    return apiConfig.postApiUrl(API_URLS.CREATE_ANNOUNCEMENT, {
        title: title,
        message: message,
        audience: audience,
        branch_id: branchId,
        created_by_id: createdById
    }, false);
}

export const deleteAnnouncement = (announcementId) => {
    return apiConfig.deleteApiUrl(API_URLS.DELETE_ANNOUNCEMENT + '?announcement_id=' + announcementId, null, false);
}

// ==================== REPORTS APIs ====================
// Note: Backend has AllowAny permission, so no auth needed
export const getReports = (branchId = null, type = 'overview') => {
    let url = API_URLS.GET_REPORTS + '?type=' + type;
    if (branchId) url += '&branch_id=' + branchId;
    return apiConfig.getApiUrl(url, null, false);
}
