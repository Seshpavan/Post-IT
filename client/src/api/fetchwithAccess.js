import axios from 'axios';

import { handleTokenRefresh } from './auth';
// import { getAccessToken } from '../utils/token';

// export async function fetchWithAccess(url, options = {}) {
//     try {
//         const accessToken = getAccessToken();
//         if (accessToken) {
//             options.headers = {
//                 ...options.headers,
//             };
//         }

//         let response = await axios(url, options);

//         // If the access token has expired, try to refresh it
//         if (response.status === 401) {
//             await handleTokenRefresh();

//             // Retry the original request with the new access token
//             const newAccessToken = getAccessToken();
//             response = await axios(url, options);
//         }

//         return response;
//     } catch (error) {
//         console.error('Error in fetchWithRefresh:', error);
//         throw error;
//     }
// }

// export async function fetchWithAccess(url, options = {}) {
//     try {

//         let response;
//         try {
//             response = await axios(url, options); // Initial request
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 // If the access token has expired, try to refresh it
//                 await handleTokenRefresh();

//                 // Retry the original request with the new access token
//                 // const newAccessToken = getAccessToken();
//                 // options.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                 response = await axios(url, options); // Retry the request
//             } else {
//                 throw error; // Throw if the error is not related to token expiration
//             }
//         }

//         return response;
//     } catch (error) {
//         console.error('Error in fetchWithAccess:', error);
//         throw error; // Rethrow the error after handling it
//     }
// }


export async function fetchWithAccess(url, options = {}) {
    try {
        // options.withCredentials = true;

        let response;
        try {
            response = await axios(url, { withCredentials: true });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await handleTokenRefresh();

                response = await axios(url, options);
            } else {
                throw error;
            }
        }

        return response;
    } catch (error) {
        console.error('Error in fetchWithAccess:', error);
        throw error;
    }
}

