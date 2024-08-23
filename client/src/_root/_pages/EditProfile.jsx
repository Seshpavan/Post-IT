import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/uisAuthenticated';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const { userData, setUserData, isLoading } = useContext(AuthContext);
    const [username, setUsername] = useState(userData.username);
    const [email, setEmail] = useState(userData.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();


// UPDATE!: Update the EditProfile component to use ReactQuery to fetch user data and update user data and also update the redux user state and the persisted data 


    if (isLoading) {
        return <div>Loading...</div>; // Add a loading spinner or placeholder
    }

    useEffect(() => {
        setUsername(userData.username);
        setEmail(userData.email);
    }, [userData]);

    const handleProfilePicChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        } else {
            setPasswordError('');
        }

        const formData = new FormData();
        if (username !== userData.username) formData.append('username', username);
        if (email !== userData.email) formData.append('email', email);
        if (password) formData.append('password', password);
        if (profilePic) formData.append('profilePic', profilePic);

        try {
            const response = await axios.put('http://localhost:3000/api/edit-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: Cookies.get('token'),
                },
            });
            setUserData(response.data);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('http://localhost:3000/api/delete-account', {
                headers: {
                    Authorization: Cookies.get('token'),
                },
            });
            Cookies.remove('token');
            Cookies.remove('userId');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className='ml-10 mt-4 bg-white h-screen rounded-md shadow-lg p-4 mr-5 pl-5'>
            <div className="flex flex-col items-center justify-center ">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-gray-300 overflow-hidden">
                                {userData.profilePic && (
                                    <img
                                        src={userData.profilePic}
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                )}
                                <input
                                    type="file"
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleProfilePicChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {passwordError && (
                                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                    <button
                        className="w-full px-4 py-2 mt-4 font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
// // import { updateProfile } from '../../redux/actions/authActions'; // Import the updateProfile action

// const EditProfile = () => {
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.auth.userData); // Access userData from Redux

//   const [formData, setFormData] = useState({
//     username: userData?.username || '',
//     profilePic: userData?.profilePic || ''
//   });

//   useEffect(() => {
//     setFormData({
//       username: userData?.username || '',
//       profilePic: userData?.profilePic || ''
//     });
//   }, [userData]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(updateProfile(formData)); // Dispatch the updateProfile action
//   };

//   return (
//     <div className="edit-profile-container">
//       <h2>Edit Profile</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="profilePic">Profile Picture URL</label>
//           <input
//             type="text"
//             name="profilePic"
//             value={formData.profilePic}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;
