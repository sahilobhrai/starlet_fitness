import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2 instead of localhost
const getLocalApiUrl = () => {
    if (Platform.OS === 'android') {
        return "http://10.0.2.2:4000";
    }
    return "http://localhost:4000";
};

const LOCAL_API_URL = getLocalApiUrl();
const PRODUCTION_API_URL = "https://external-api-url.com";
const IS_PRODUCTION = false;
const BASE_URL = IS_PRODUCTION ? PRODUCTION_API_URL : LOCAL_API_URL;

console.log('=== API CONFIG ===');
console.log('Platform:', Platform.OS);
console.log('Base URL:', BASE_URL);

const getApiUrl = async (url, id) => {
    try {
        console.log('=== GET API CALL START ===');
        const baseUrl = BASE_URL + url;
        const fullUrl = id ? `${baseUrl}/${id}` : baseUrl;
        console.log('Full URL:', fullUrl);

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Response Status:', response.status);
        const responseData = await response.json();
        console.log('Response Data:', JSON.stringify(responseData, null, 2));

        if (!response.ok) {
            return { error: responseData.message || `Server error: ${response.status}` };
        }

        return responseData;
    } catch (error) {
        console.error('=== GET API CALL ERROR ===');
        console.error("Error:", error);
        return { error: error.message || 'Unknown error occurred' };
    }
};


const postApiUrl = async (url, payload, isAuth = false) => {
    try {
        console.log('=== POST API CALL START ===');
        console.log('URL:', url);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        console.log('IsAuth:', isAuth);

        let accessToken = null;
        if (isAuth) {
            accessToken = await AsyncStorage.getItem('accessToken');
            console.log('Access Token:', accessToken ? 'Found' : 'Not found');
            if (accessToken) {
                payload.token = accessToken;
            }
        }

        const fullUrl = BASE_URL + url;
        console.log('Full URL:', fullUrl);

        const headers = {
            'Content-Type': 'application/json',
        };

        if (isAuth && accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        console.log('Request Headers:', JSON.stringify(headers, null, 2));

        // Make the POST request using fetch
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        console.log('=== POST API RESPONSE RECEIVED ===');
        console.log('Response Status:', response.status);
        console.log('Response OK:', response.ok);

        const responseData = await response.json();
        console.log('Response Data:', JSON.stringify(responseData, null, 2));

        if (!response.ok) {
            console.error('=== POST API CALL ERROR ===');
            console.error('HTTP Error:', response.status);
            return { error: responseData.message || `Server error: ${response.status}` };
        }

        console.log('=== POST API CALL SUCCESS ===');
        return responseData;

    } catch (error) {
        console.error('=== POST API CALL EXCEPTION ===');
        console.error('Error Message:', error.message);
        console.error('Error Details:', error);

        if (error.message === 'Network request failed' || error.message.includes('fetch')) {
            return { error: 'Network error - could not reach server. Check if backend is running.' };
        }

        return { error: error.message || 'Unknown error occurred' };
    }
}


const putApiUrl = async (url, id, payload, isAuth = false) => {
    try {
        console.log('=== PUT API CALL START ===');
        let accessToken = null;
        if (isAuth) {
            accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                payload.token = accessToken;
            }
        }

        const baseUrl = BASE_URL + url;
        const fullUrl = id ? `${baseUrl}/${id}` : baseUrl;
        console.log('Full URL:', fullUrl);

        const headers = {
            'Content-Type': 'application/json',
        };

        if (isAuth && accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(fullUrl, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(payload),
        });

        console.log('Response Status:', response.status);
        const responseData = await response.json();
        console.log('Response Data:', JSON.stringify(responseData, null, 2));

        if (!response.ok) {
            return { error: responseData.message || `Server error: ${response.status}` };
        }

        return responseData;
    }
    catch (error) {
        console.error('=== PUT API CALL ERROR ===');
        console.error("Error:", error);
        return { error: error.message || 'Unknown error occurred' };
    }
}

const deleteApiUrl = async (url, id, isAuth = false) => {
    try {
        console.log('=== DELETE API CALL START ===');
        let accessToken = null;
        if (isAuth) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const baseUrl = BASE_URL + url;
        const fullUrl = id ? `${baseUrl}/${id}` : baseUrl;
        console.log('Full URL:', fullUrl);

        const headers = {
            'Content-Type': 'application/json',
        };

        if (isAuth && accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(fullUrl, {
            method: 'DELETE',
            headers: headers,
        });

        console.log('Response Status:', response.status);
        const responseData = await response.json();
        console.log('Response Data:', JSON.stringify(responseData, null, 2));

        if (!response.ok) {
            return { error: responseData.message || `Server error: ${response.status}` };
        }

        return responseData;
    }
    catch (error) {
        console.error('=== DELETE API CALL ERROR ===');
        console.error("Error:", error);
        return { error: error.message || 'Unknown error occurred' };
    }
}

export default {
    getApiUrl,
    postApiUrl,
    putApiUrl,
    deleteApiUrl
};