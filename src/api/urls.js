
export const API_URLS = {
    // Authentication
    SEND_OTP: '/api/send-otp/',
    RESEND_OTP: '/api/send-otp/',
    VERIFY_OTP: '/api/verify-otp/',

    // Slot Management (Manager/Trainer)
    GENERATE_SLOTS: '/api/slots/generate/',
    GET_SLOTS: '/api/slots/',
    GET_WEEK_SLOTS: '/api/slots/week/',
    BLOCK_SLOT: '/api/slots/block/',
    BLOCK_SLOT_RANGE: '/api/slots/block-range/',
    SET_DAY_OFF: '/api/slots/day-off/',
    GET_SLOT_CONFIG: '/api/slots/config/',
    UPDATE_SLOT_CONFIG: '/api/slots/config/update/',

    // Client APIs
    CLIENT_PROFILE: '/api/client/profile/',
    UPDATE_CLIENT_PROFILE: '/api/client/profile/update/',
    CLIENT_AVAILABLE_SLOTS: '/api/client/available-slots/',
    CLIENT_SESSIONS: '/api/client/sessions/',
    BOOK_SESSION: '/api/sessions/book/',
    CANCEL_SESSION: '/api/sessions/cancel/',
    GENERATE_SESSION_QR: '/api/client/session/qr/generate/',

    // Trainer APIs
    TRAINER_DASHBOARD: '/api/trainer/dashboard/',
    TRAINER_ASSIGNED_SESSIONS: '/api/trainer/assigned-sessions/',
    TRAINER_UPCOMING_SESSIONS: '/api/trainer/upcoming-sessions/',
    TRAINER_EARNINGS: '/api/trainer/earnings/',
    START_SESSION: '/api/trainer/start-session/',
    END_SESSION: '/api/trainer/end-session/',
    SCAN_SESSION_QR: '/api/trainer/session/scan/',
    GET_CLIENT_BCA: '/api/trainer/client-bca/',
    SYNC_CLIENT_BCA: '/api/trainer/sync-bca/',
    PREVIEW_BCA: '/api/trainer/preview-bca/',
    UPDATE_MEASUREMENTS: '/api/trainer/update-measurements/',

    // Manager Dashboard APIs
    MANAGER_DASHBOARD: '/api/manager/dashboard/',
    BRANCH_SESSIONS: '/api/manager/sessions/',
    BRANCH_TRAINERS: '/api/manager/trainers/',
    BRANCH_CLIENTS: '/api/manager/clients/',
    ENROLL_CLIENT: '/api/manager/enroll-client/',
    ENROLL_TRAINER: '/api/manager/enroll-trainer/',
    TRAINER_SESSIONS: '/api/manager/trainer-sessions/',

    // Branch CRUD APIs (Owner)
    GET_BRANCHES: '/api/branches/',
    CREATE_BRANCH: '/api/branches/create/',
    UPDATE_BRANCH: '/api/branches/update/',
    DELETE_BRANCH: '/api/branches/delete/',

    // Invoice APIs
    GET_INVOICES: '/api/invoices/',
    CREATE_INVOICE: '/api/invoices/create/',

    // Announcement APIs
    GET_ANNOUNCEMENTS: '/api/announcements/',
    CREATE_ANNOUNCEMENT: '/api/announcements/create/',
    DELETE_ANNOUNCEMENT: '/api/announcements/delete/',

    // Reports APIs
    GET_REPORTS: '/api/reports/',
}
