// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../../context/uisAuthenticated';
// import Post from '../../components/Post'; 

// const Profile = () => {
//   const { userData,isLoading } = useContext(AuthContext);

//   if (isLoading) {
//     return <div>Loading...</div>; // Add a loading spinner or placeholder
// }

//   const handleEdit = () => {
//     window.location.href = '/editprofile'; 
//   } 

//   return (
//     <div className='ml-10 mt-4 bg-white rounded-md shadow-lg p-4 mr-5 pl-5'>
//       <div className="user-dets flex items-center">
//         <div className="profile-pic h-32 w-32 rounded-full bg-gray-300 mb-4 overflow-hidden">
//           {userData.profilePic && (
//             <img
//               src={userData.profilePic}
//               alt="Profile"
//               className="h-full w-full rounded-full object-cover"
//             />
//           )}
//         </div>
//         <div className="flex flex-col ml-10 mt-3">
//           <div className="username font-semibold text-3xl">{userData.username}</div>
//           <div className="flex mt-2">
//             <div className="det1 text-center mr-4">
//               {userData.MyPosts ? userData.MyPosts.length : 0} <br /><span className='font-medium'>Posts</span>
//             </div>
//             <div className="det2 text-center mr-4">
//               {userData.friends ? userData.friends.length : 0} <br /><span className='font-medium'>Friends</span>
//             </div>
//           </div>
//         </div>
//         <div onClick={handleEdit} className="button absolute right-20 top-16 p-3 text-white font-medium shadow-md hover:cursor-pointer hover:bg-red-600 rounded-2xl bg-red-500">Edit Profile</div>
//       </div>
//       <div className="user-posts mt-8">
//         {userData.MyPosts && userData.MyPosts.length > 0 ? (
//           <div className="posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {userData.MyPosts.map(postId => (
//               <Post key={postId} postId={postId} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500">No posts yet</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import Post from '../../components/Post';


// UPDATE!: Update the Profile component to use Redux to access userData

const Profile = () => {
    const userData = useSelector((state) => state.auth.userData); // Access userData from Redux
    const isLoading = useSelector((state) => state.auth.isLoading); // Access loading state

    if (isLoading) {
        return <div>Loading...</div>; // Add a loading spinner or placeholder
    }

    const handleEdit = () => {
        window.location.href = '/editprofile';
    }

    return (
        <div className='ml-10 mt-4 bg-white rounded-md shadow-lg p-4 mr-5 pl-5'>
            <div className="user-dets flex items-center">
                <div className="profile-pic h-32 w-32 rounded-full bg-gray-300 mb-4 overflow-hidden">
                    {userData.profilePic && (
                        <img
                            src={userData.profilePic}
                            alt="Profile"
                            className="h-full w-full rounded-full object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col ml-10 mt-3">
                    <div className="username font-semibold text-3xl">{userData.username}</div>
                    <div className="flex mt-2">
                        <div className="det1 text-center mr-4">
                            {userData.MyPosts ? userData.MyPosts.length : 0} <br /><span className='font-medium'>Posts</span>
                        </div>
                        <div className="det2 text-center mr-4">
                            {userData.friends ? userData.friends.length : 0} <br /><span className='font-medium'>Friends</span>
                        </div>
                    </div>
                </div>
                <div onClick={handleEdit} className="button absolute right-20 top-16 p-3 text-white font-medium shadow-md hover:cursor-pointer hover:bg-red-600 rounded-2xl bg-red-500">Edit Profile</div>
            </div>
            <div className="user-posts mt-8">
                {userData.MyPosts && userData.MyPosts.length > 0 ? (
                    <div className="posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userData.MyPosts.map((post, index) => (
                            <Post key={index} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-lg text-gray-500">
                        No posts yet. Share your first post!
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
