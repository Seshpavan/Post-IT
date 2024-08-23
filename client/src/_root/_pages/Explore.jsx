import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { InView } from 'react-intersection-observer';


// UPDATE!: Update the Profile component to use Redux to access userData 


const fetchPosts = async ({ pageParam = 1 }) => {
    const res = await axios.get(`http://localhost:3000/api/posts/explore?page=${pageParam}&limit=8`);
    console.log("INSIDE FETCH POSTS", res.data);
    return res.data;
};


const Explore = () => {
    const navigate = useNavigate();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 8) {
                return allPages.length + 1;
            }
            return undefined;
        },
    });

    useEffect(() => {
        console.log("INSIDE USE EFFECT", data);
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };


    return (
        <div className='ml-10 mt-4 bg-white rounded-md shadow-lg p-4 mr-5 pl-5'>
            <div className="flex flex-col w-full min-h-screen bg-background">
                <header className="flex items-center justify-between h-16 px-4 border-b border-muted md:px-6">
                    <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
                        <InstagramIcon className="w-6 h-6" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <div className="relative flex-1 max-w-md">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search"
                            className="w-full pl-9 pr-4 py-2 rounded-md bg-muted text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </header>
                <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:p-6">
                    {data?.pages.map((page, pageIndex) => (
                        page.map((post, index) => (
                            <div
                                key={`${pageIndex}-${index}`}
                                className="group relative overflow-hidden rounded-md cursor-pointer"
                                onClick={() => handlePostClick(post._id)}
                            >
                                {post.postImages.length > 0 ? (
                                    <img
                                        src={`http://localhost:3000/public/images/${post.postImages[0].url}`}
                                        alt={`Image ${index + 1}`}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <video
                                        src={`http://localhost:3000/public/videos/${post.postVideos[0].url}`}
                                        width={400}
                                        height={400}
                                        autoPlay
                                        loop
                                        muted
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                                        <HeartIcon className="w-4 h-4" />
                                        <span>{post.likes ? post.likes.length : 0}</span>
                                        <MessageCircleIcon className="w-4 h-4" />
                                        <span>{post.comments.length}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ))}
                    <InView
                        as="div"
                        onChange={(inView) => {
                            if (inView && hasNextPage) {
                                fetchNextPage();
                            }
                        }}
                    >
                        {isFetchingNextPage ? <div>Loading more...</div> : null}
                    </InView>
                </main>
            </div>
        </div>
    )
}

function HeartIcon(props) {
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
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    );
}

function InstagramIcon(props) {
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
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function MessageCircleIcon(props) {
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
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
}


function SearchIcon(props) {
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function XIcon(props) {
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}


export default Explore