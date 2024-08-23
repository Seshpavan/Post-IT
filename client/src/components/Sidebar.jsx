import React, { useState } from 'react';
import { FaSignOutAlt, FaCompass, FaUserPlus } from 'react-icons/fa';
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {clearUserData} from '../utils/storage.js';
import { toast } from "react-toastify";


// UPDATE!: 


const Sidebar = () => {
  const [active, setActive] = useState(window.location.pathname.split('/')[1]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  if(user.loading){
    return <div> ... </div>
  }

  const handleLogout = async () => {
    console.log('Logging out');
    await clearUserData();
    navigate('/login'); 
    toast.success('Logged out successfully');
  };


  const handleNavigate = (path, section) => {
    setActive(section);
    navigate(path);
  };

  return (
    <div className="sidebar w-64 bg-white h-full rounded-md shadow-md flex flex-col items-center p-4">
      {/* Profile */}
      {
        (active === 'profile' || active === 'editprofile') ? (
          ""
        ) : (
          <div
            className={`profile-section flex flex-col items-center mb-8 cursor-pointer ${active === 'profile' ? 'text-bold text-gray-800' : 'text-gray-600'
              }`}
            onClick={() => handleNavigate('/profile', 'profile')}
          >
            <div className="profile-pic h-24 w-24 rounded-full bg-gray-300 mb-4">
            {user.userData && user.userData.profilePic ? (
  <img
    src={userData.profilePic}
    alt="Profile"
    className="h-full w-full rounded-full object-cover"
  />
) : (
  <img
    alt="Profile"
    className="h-full w-full rounded-full object-cover"
  />
)}
            </div>
            {
              user.userData && user.userData.username ? (
                <div className="username text-xl font-semibold">{user.userData.username}</div>
              ) : (
                " "
              )
            }
          </div>
        )
      }

      {/* Home */}
      <div
        className={`home w-full flex items-center p-4 mb-4 cursor-pointer hover:bg-gray-100 rounded-md ${active === 'home' ? 'text-bold text-gray-800' : 'text-gray-600'
          }`}
        onClick={() => handleNavigate('/home', 'home')}
      >
        <AiFillHome className={`text-2xl mr-3 ${active === 'home' ? 'text-gray-800' : 'text-gray-600'}`} />
        <span className="text-lg">Home</span>
      </div>

      {/* Explore */}
      <div
        className={`explore w-full flex items-center p-4 mb-4 cursor-pointer hover:bg-gray-100 rounded-md ${active === 'explore' ? 'text-bold text-gray-800' : 'text-gray-600'
          }`}
        onClick={() => handleNavigate('/explore', 'explore')}
      >
        <FaCompass className={`text-2xl mr-3 ${active === 'explore' ? 'text-gray-800' : 'text-gray-600'}`} />
        <span className="text-lg">Explore</span>
      </div>

      {/* Friend Requests */}
      <div
        className={`frnd-requests w-full flex items-center p-4 mb-4 cursor-pointer hover:bg-gray-100 rounded-md ${active === 'frndRequests' ? 'text-bold text-gray-800' : 'text-gray-600'
          }`}
        onClick={() => handleNavigate('/frnd-req', 'frndRequests')}
      >
        <FaUserPlus className={`text-2xl mr-3 ${active === 'frndRequests' ? 'text-gray-800' : 'text-gray-600'}`} />
        <span className="text-lg">Friend Requests</span>
      </div>

      {/* Logout */}
      <div
        className="logout w-full flex items-center p-4 cursor-pointer hover:bg-gray-100 rounded-md"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="text-2xl mr-3 text-gray-600" />
        <span className="text-lg text-gray-600">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;


