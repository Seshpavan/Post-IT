import React, { useState } from 'react';


// UPDATE!: Update the friends data using Redux user state and also try to add the friends data dynamically from the database using ReactQuery

const DispFriends = () => {
    const [dynamicFriends, setDynamicFriends] = useState([
        { id: '1', username: 'JohnDoe', profilePic: 'https://example.com/profile1.jpg' },
        { id: '2', username: 'JaneSmith', profilePic: 'https://example.com/profile2.jpg' },
        { id: '3', username: 'AliceJohnson', profilePic: 'https://example.com/profile3.jpg' }
    ]);

    return (
        <div className="friends-sidebar ">
            <h2 className="text-2xl font-semibold mb-4">Friends</h2>
            <ul>
                {dynamicFriends.map((friend) => (
                    <li key={friend.id} className="mb-2">
                        <div className="flex items-center gap-2">
                            <img src={friend.profilePic} alt={friend.username} className="w-10 h-10 mr-2 rounded-full object-cover" />
                            <span>{friend.username}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DispFriends