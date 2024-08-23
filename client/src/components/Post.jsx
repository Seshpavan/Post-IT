import React, { useState, useEffect, useContext } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaRegComment, FaCheck } from 'react-icons/fa';
import { PiPaperPlaneTiltBold } from 'react-icons/pi';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useSelector } from 'react-redux';

import AddFriendButton from './AddFriendButton';
import { fetchWithAccess } from '../api/fetchwithAccess';


// UPDATE!: Update the currentUser data using the Redux user state and check if the user is a friend of the post user using the friends data and set the isFriend state accordingly.
// If the user adds the post user as his friend then he should not see the Add Friend button.  

const PHeader = ({ username, profilePic }) => {
    const userData = useSelector((state) => state.user.currentUser);

    return (
        <div className="head flex items-center justify-between gap-4 rounded-t-2xl h-16 w-full bg-green-300 p-3">
            <div className="flex items-center gap-3">
                <div className="dp h-9 w-9 rounded-full bg-black overflow-hidden">
                    <img src={profilePic} alt={username} className="h-full w-full object-cover" />
                </div>
                <div className="username text-xl font-semibold">{username}</div>
            </div>
            <div className="add-friend">
                {userData.username !== username && (
                    // <AddFriendButton SUser={userData.username} rUser={username} />
                    <h1>YO</h1>
                )}
            </div>
        </div>
    );
};




const PFooter = ({ postId, username, caption, likes, comments, onLike, onComment, showComments, setShowComments }) => {
    const [liked, setLiked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [visibleComments, setVisibleComments] = useState(5);

    const handleLike = async () => {
        setLiked(!liked);
        await onLike(postId, !liked);
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            await onComment(postId, newComment);
            setNewComment('');
        }
    };

    const handleShowMoreComments = () => {
        setVisibleComments(prevVisibleComments => prevVisibleComments + 5);
    };

    const displayedComments = comments?.slice(0, visibleComments);

    return (
        <div className="flex flex-col items-start pt-2 px-3 gap-4 w-full">
            <div className="icons flex gap-4 items-center w-full">
                <div className="heart flex gap-1.5 items-center">
                    {liked ? (
                        <FaHeart className="text-red-500 text-3xl cursor-pointer" onClick={handleLike} />
                    ) : (
                        <FaRegHeart className="text-slate-500 text-3xl cursor-pointer" onClick={handleLike} />
                    )}
                    <span>{likes} Likes</span>
                </div>
                <div className="comment flex gap-1.5 items-center">
                    {showComments ? (
                        <FaComment className="text-blue-500 text-3xl cursor-pointer" onClick={() => setShowComments(!showComments)} />
                    ) : (
                        <FaRegComment className="text-slate-500 text-3xl cursor-pointer" onClick={() => setShowComments(!showComments)} />
                    )}
                    <span>{comments?.length} Comments</span>
                </div>
                <div className="share flex gap-2 items-center">
                    <PiPaperPlaneTiltBold className="text-slate-500 text-3xl rotate-45 cursor-pointer" />
                    <span>Share</span>
                </div>
            </div>
            <div>
                <div className="caption text-xl font-semibold">{username}</div>
                <div>{caption}</div>
            </div>

            {showComments && (
                <div className="comments w-full mt-2">
                    <div className="max-h-40 overflow-y-auto">
                        {displayedComments.map((comment, index) => (
                            <div key={index} className="mb-1">
                                <span className="font-semibold">{comment.username}: </span>
                                {comment.text}
                            </div>
                        ))}
                        {comments.length > visibleComments && (
                            <div className="text-blue-500 cursor-pointer" onClick={handleShowMoreComments}>
                                Show more comments
                            </div>
                        )}
                    </div>
                    <div className="w-full flex items-center gap-3 p-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full border rounded px-2 py-1"
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PImg = ({ fileId }) => {
    return (
        <div className="w-full h-[400px]">
            <img src={`http://localhost:3000/api/media/${fileId}`} alt="" className="h-full w-full object-contain" />
        </div>
    );
};

const PVideo = ({ fileId }) => {
    return (
        <div className="w-full h-[400px]">
                <video controls className="h-full w-full object-cover">
                    <source controls src={`http://localhost:3000/api/media/${fileId}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
        </div>
    );
};



const Post = ({ postId, username, profilePic, caption }) => {
    const [showComments, setShowComments] = useState(false);

    const [postData, setPostData] = useState({
        likes: 0,
        comments: [],
        media: []
    });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await fetchWithAccess(`http://localhost:3000/api/posts/${postId}`);
                // const response = await axios.get(`http://localhost:3000/api/posts/${postId}`);
                const data = response.data;
                setPostData(data);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };
        fetchPostData();
    }, [postId]);


    const handleLike = async (postId, liked) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/posts/${postId}/like`, { liked });
            setPostData(prevData => ({
                ...prevData,
                likes: response.data.likes
            }));
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    const handleComment = async (postId, text) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/posts/${postId}/comment`, { text });
            setPostData(prevData => ({
                ...prevData,
                comments: [...prevData.comments, response.data]
            }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="post w-[600px] flex flex-col bg-white rounded-2xl mb-5 shadow-md">
            <PHeader
                username={username}
                profilePic={profilePic}
            />
            <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                useKeyboardArrows
                className="w-full"
            >
                {postData.media.map((media, index) => {
                    if (media.fileType === 'image/jpeg' || media.fileType === 'image/png' || media.fileType === 'image/webp') {
                        return <PImg key={index} fileId={media.fileId} />;
                    } else {
                        return <PVideo key={index} fileId={media.fileId} />;
                    }
                })}
            </Carousel>
            <PFooter
                postId={postId}
                username={username}
                caption={caption}
                likes={postData.likes}
                comments={postData.comments}
                onLike={handleLike}
                onComment={handleComment}
                showComments={showComments}
                setShowComments={setShowComments}
            />
        </div>
    );


};

export default Post;
