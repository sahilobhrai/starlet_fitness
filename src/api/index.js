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