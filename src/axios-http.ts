import axios from 'axios';
import { showToast } from './common/helpers';
import { useAuthStore } from './stores/AuthStore';
import { useNavigationStore } from './stores/NavigationStore';

const trainingModeAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

trainingModeAPI.interceptors.response.use(response => {
    // Handle successful responses
    return response;
}, error => {
    const authStore = useAuthStore();
    const navigationStore = useNavigationStore();
    // Handle errors
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        trainingModeAPI.defaults.headers.common['Authorization'] = '';
        authStore.clearPiniaState();
        navigationStore.openMenuModalContainer();
        authStore.openLoginForm();
        
        showToast('You\'re not currently logged in! Please log in to continue.', 3000, 'error');

    } else if (error.response && error.response.status === 409) {
        if(error.response.data.message.includes('Username is already taken')) {
            showToast('Username is already taken. Please choose another.', 5000, 'error');
        } else {
            showToast('Whoops! Looks like there was an issue retrieving images. Please reload your browser.', 5000, 'error');
        }
    } else if(error.response && error.response.status === 403) {
        showToast('Whoops, looks like something went wrong. Try reloading the page.', 3000, 'error');
    }
    return Promise.reject(error);
});

export default trainingModeAPI;