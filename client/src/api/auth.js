import axios from 'axios';
import { redirectToLogin,clearUserData } from '../utils/storage';

// export async function handleTokenRefresh() {
//     try {
//         const response = await axios.post('http://localhost:3000/api/refresh-token', 
//             { withCredentials: true }, 
//     );

//         if (response.status === 200) {
//             const data = response.data;
//             // storeAccessToken(data.accessToken);
//         } else {
//             clearUserData();
//         }
//     } catch (error) {
//         console.error('Error refreshing token:', error);
//         event.preventDefault();
//         clearUserData();
//         // redirectToLogin();
//     }
// }



export async function handleTokenRefresh() {
    try {
        const response = await axios.post(
            'http://localhost:3000/api/refresh-token', 
            { withCredentials: true }
        );

        if (response.status === 200) {
            console.log('Token refreshed');
        } else {
            clearUserData();
            redirectToLogin();
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        clearUserData();
        // redirectToLogin();
    }
}
