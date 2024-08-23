import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Post from './Post';


// UPDATE!: Update the PostPage component to fetch the post data using ReactQuery 


const fetchPost = async ({ queryKey }) => {
    const [, postId] = queryKey;
    const res = await axios.get(`http://localhost:3000/api/posts/${postId}`);
    return res.data;
};

export default function PostPage() {
    const { id } = useParams();

    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', id],
        queryFn: fetchPost,
    });

    useEffect(() => {
        console.log('PostPage mounted',post);
    }
    , [post]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading post</div>;

    return (
        <div className="relative flex ml-10 mt-4 h-screen bg-white rounded-md shadow-lg pt-12 mr-5 pl-48">
            <button
                className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded-full"
                onClick={() => window.history.back()}
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <Post
                postId={post._id}
                username={post.userId.username}
                profilePic={post.profilePic}
                postImages={post.postImages}
                postVideos={post.postVideos}
                caption={post.caption}
            />
        </div>
    );
}

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
