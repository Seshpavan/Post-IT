import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';



// UPDATE!: Update the API endpoint if needed

const CreatePost = ({ profilePic }) => {
    const [postText, setPostText] = useState('');
    const [postMedia, setPostMedia] = useState([]);
    const [fileNames, setFileNames] = useState([]);

    const handleMediaUpload = (event) => {
        const files = event.target.files;
        const newFiles = Array.from(files);
        const newFileNames = newFiles.map(file => file.name);

        setPostMedia([...postMedia, ...newFiles]);
        setFileNames([...fileNames, ...newFileNames]);
    };

    const handleRemoveMedia = (index) => {
        const updatedMedia = [...postMedia];
        updatedMedia.splice(index, 1);

        const updatedFileNames = [...fileNames];
        updatedFileNames.splice(index, 1);

        setPostMedia(updatedMedia);
        setFileNames(updatedFileNames);
    };

    const handlePostSubmit = async () => {
        const formData = new FormData();
        formData.append('text', postText);
        postMedia.forEach(file => {
            formData.append('media', file);
        });

        // const token = Cookies.get("accessToken");
        try {
            const response = await axios.post('http://localhost:3000/api/create-post', formData 
                ,{
                withCredentials: true,
            }
            );
            console.log('Post created successfully:', response.data);
            toast.success(response.data.message);
            setPostText('');
            setPostMedia([]);
            setFileNames([]);
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response) {
                console.error('Error response:', error.response);
            }
        }
    };

    return (
        <div className="create-post-container p-4 border rounded-lg shadow-lg bg-white">
            <div className="flex items-center gap-4 mb-4">
                <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full" />
                <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full h-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col gap-2 mb-2 items-start">
                <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} multiple className="hidden" id="mediaUpload" />
                <label htmlFor="mediaUpload" className="button cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Upload Media
                </label>
                <div className="flex flex-col gap-2 mt-2">
                    {fileNames.map((fileName, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-700">{fileName}</span>
                            <button
                                onClick={() => handleRemoveMedia(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={handlePostSubmit}
                className="submit-button bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
            >
                Create Post
            </button>
        </div>
    );
};

export default CreatePost;
