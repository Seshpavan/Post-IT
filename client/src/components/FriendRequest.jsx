import React from 'react'

const FriendRequest = () => {

// UPDATE!:
// Now if i add the user as a friend, the friend request will be removed from the friend request list and the user will be added to the friends list
// This update should also be reflected in the redux user state and the persisted data and also in the database

    return (
        <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex-shrink-0">
            <img
                src={userData.profilePic}
                alt="Profile"
                className="h-14 w-14 bg-black rounded-full object-cover" />
        </div>
        <div className="flex-1 space-y-1">
            <div className="text-lg font-medium">{userData.username}</div>
        </div>
        <div className="flex gap-2">
            {/* <Button variant="outline">Reject</Button>
            <Button>Accept</Button> */}
            <button className="px-4 py-2 border border-red-600 text-red-600 bg-transparent rounded-lg hover:bg-blue-50">Reject</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700">Accept</button>
        </div>
    </div>
    )
}

export default FriendRequest