import React, { useState, useEffect } from 'react';
import axios from 'axios';



// UPDATE!: Here update the surrentUser data using Redux user state

const AddFriendButton = ({ rUser, sUser }) => {
    const [requestStatus, setRequestStatus] = useState(null);

    useEffect(() => {
        // Check if a friend request has already been sent
        const checkFriendRequest = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/friends/check-request', {
                    params: { senderId: sUser, receiverId: rUser }
                });
                console.log(response);
                setRequestStatus(response.data.message);
            } catch (error) {
                console.log(error);
                setRequestStatus(null);
            }
        };
        checkFriendRequest();
    }, [sUser, rUser]);

    const sendFriendRequest = async () => {
        try {
            console.log(sUser, rUser);
            // First check if a friend request has already been sent
            const checkResponse = await axios.get('http://localhost:3000/api/friends/check-request', {
                params: { senderId: sUser, receiverId: rUser }
            });
            console.log(checkResponse);
            if (checkResponse.data.message === 'Friend request already sent') {
                setRequestStatus('Friend request already sent');
                return;
            }

            // If no request has been sent, proceed to send the friend request
            const response = await axios.post('http://localhost:3000/api/friends/send-request', {
                senderId: sUser,
                receiverId: rUser
            });
            setRequestStatus(response.data.message);
        } catch (error) {
            console.log(error);
            setRequestStatus(error.response?.data?.message || 'Error sending friend request');
        }
    };

    return (
        // <div>
        //     {requestStatus === 'Friend request already sent' ? (
        //         <p>{requestStatus}</p>
        //     ) : (
        //         <button onClick={sendFriendRequest} className="bg-blue-500 text-white px-4 py-2 rounded">
        //             Add Friend
        //         </button>
        //     )}
        //     {requestStatus && <p>{requestStatus}</p>}
        // </div>
        <button onClick={sendFriendRequest} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={requestStatus === 'Friend request already sent'}>
            {requestStatus === 'Friend request already sent' ? 'Request Sent' : 'Add Friend'}
        </button>
    );
};

export default AddFriendButton;