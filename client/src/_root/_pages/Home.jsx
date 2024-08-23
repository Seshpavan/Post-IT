import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


import CreatePost from "../../components/CreatePost";
import DispFriends from "../../components/DispFriends";
import Post from "../../components/Post";

import {fetchWithAccess} from '../../api/fetchwithAccess.js';
import axios from 'axios';

// UPDATE!: set the dispfriends component

const Home = () => {
  const [posts, setPosts] = useState([]); 
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.user.currentUser.userData)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const response = await axios.get('http://localhost:3000/api/posts');
        const response = await fetchWithAccess('http://localhost:3000/api/posts');
        if (Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
        } else {
          setError('API did not return an array');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
  }, [userData]);


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main content area */}
      <div className="flex-1 flex flex-col mx-4 lg:mr-[25%] lg:ml-8 space-y-4">
        <section className="mt-4">
          <CreatePost className="w-full bg-white rounded-lg shadow-md p-4"/>
        </section>
        <section className="flex-col flex-1 bg-white rounded-lg shadow-md p-4 justify-center pl-40">
          {/* Display all the posts below here */}
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                postId={post._id}
                username={post.userId.username}
                profilePic={post.userId.profilePic}
                postImages={post.postImages}
                postVideos={post.postVideos}
                caption={post.caption}
              />
            ))
          )}
        </section>
      </div>

      {/* DispFriends component */}
      <section className="hidden lg:block fixed top-0 right-0 w-1/5 h-[95vh] bg-white rounded-lg shadow-md mt-4 mb-4 p-4 overflow-y-auto">
        <DispFriends />
      </section>
    </div>
  );
};

export default Home;


