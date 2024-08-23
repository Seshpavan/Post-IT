import axios from 'axios';

// Redirect the user to the login page
export function redirectToLogin() {
    window.location.href = '/login';
}

// Remove user data from storage
export async function clearUserData() {
    try {
        console.log('clearUserData: Clearing user data');
        const response = await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
        localStorage.removeItem('persist:root');
    } catch (error) {
        console.log('clearUserData: Error clearing user data');
        console.error(error);
    }
}

// Retrieve user 
export function getUser() {
    const prefs = localStorage.getItem('userData');
    return prefs ? JSON.parse(prefs) : null;
}
