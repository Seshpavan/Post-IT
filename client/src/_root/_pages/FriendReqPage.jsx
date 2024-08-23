import React,{ useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const FriendReqPage = () => {

    // UPDATE!: Update the currentUserId using Redux user state and make the API call to fetch the friend requests using ReactQuery

    const [friendRequests, setFriendRequests] = useState([]);
    // const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading...</div>; // Add a loading spinner or placeholder
    }

    useEffect(() => {
        // Fetch friend requests
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/friends/requests/${currentUserId}`);
                setFriendRequests(response.data.friendRequests);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();
    }, [currentUserId]);

    const acceptFriendRequest = async (senderId) => {
        try {
            await axios.post(`http://localhost:3000/api/friends/accept-request`, {
                senderId,
                recipientId: currentUserId
            });
            setFriendRequests(friendRequests.filter(request => request.senderId !== senderId));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const rejectFriendRequest = async (senderId) => {
        try {
            await axios.post(`http://localhost:3000/api/friends/reject-request`, {
                senderId,
                recipientId: currentUserId
            });
            setFriendRequests(friendRequests.filter(request => request.senderId !== senderId));
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    return (
        <div className='relative ml-10 mt-4 min-h-[95vh] bg-white rounded-md shadow-lg p-4 mr-5 pl-5'>
            <button
                className=" top-4 left-4 bg-gray-800 text-white p-2 rounded-full"
                onClick={() => window.history.back()}
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            {friendRequests.length === 0 ? (
                <p className='mt-5 ml-3 font-semibold text-[3vw]'>No new Friend requests</p>
            ) : (
                <ul>
                    {friendRequests.map(request => (
                        <li key={request.senderId} className="flex items-center gap-4">
                            <img src={`http://localhost:3000/images/${request.senderProfilePic}`} alt={`${request.senderUsername}'s profile`} className="w-12 h-12 rounded-full" />
                            <span>{request.senderUsername}</span>
                            <div className="ml-auto">
                                <button onClick={() => acceptFriendRequest(request.senderId)} className="bg-green-500 text-white px-2 py-1 rounded">
                                    Accept
                                </button>
                                <button onClick={() => rejectFriendRequest(request.senderId)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


function ArrowLeftIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

export default FriendReqPage