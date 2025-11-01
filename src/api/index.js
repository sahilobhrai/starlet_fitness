import apiConfig from './apiConfig';
import { API_URLS } from './urls';

export const sendOtp = (phoneNumber) => {
    return apiConfig.postApiUrl(API_URLS.SEND_OTP, { phoneNumber });
}

export const resendOtp = (phoneNumber) => {
    return apiConfig.postApiUrl(API_URLS.RESEND_OTP, { phoneNumber });
}

export const verifyOtp = (phoneNumber, otp) => {
    return apiConfig.postApiUrl(API_URLS.VERIFY_OTP, { phoneNumber, otp });
}

export const bookSession = (sessionData, isAuth = true) => {
    return apiConfig.postApiUrl(API_URLS.BOOK_SESSION, sessionData, isAuth);
}

export const getSessionsByDate = (date) => {
    return apiConfig.getApiUrl(API_URLS.GET_SESSIONS_BY_DATE + date, null, true);
}

export const getUserById = (userId) => {
    return apiConfig.getApiUrl(API_URLS.GET_USER_BY_ID + userId, null, true);
}