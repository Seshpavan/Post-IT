import { Router } from 'express';
import Post from '../models/post-model.js';
import { gfsBucket } from '../config/mongooseConnection.js';

const app = Router();

// Get a single post
app.get('/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('userId', 'name username');
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // Generate media URLs
    const mediaUrls = post.media.map((media) => {
        const url = gfsBucket.openDownloadStream(media.fileId).url;
        return { fileId: media.fileId, fileType: media.fileType, url };
    });

    // Send the post data, including the media URLs
    res.json({
        _id: post._id,
        userId: post.userId,
        caption: post.caption,
        media: mediaUrls,
    });
});


// Get all posts
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name username UserDP');
        res.status(200).json({ posts });
    } catch (error) {
        console.log('Error getting posts:', error);
        res.status(500).json({ message: 'Error getting posts' });
    }
});

// Likes on a post
app.post('/:id/like', (req, res) => {
    res.send('Posts route');
});

// Comments on a post
app.post('/:id/comment', (req, res) => {
    res.send('Posts route');
});

// // Edit a post
// app.post('/:id/edit', (req, res) => {
//     res.send('Posts route');
// });

// Delete a post
app.post('/:id/delete', (req, res) => {
    res.send('Posts route');
});

// Get all posts by a user
app.post('/:id/all', (req, res) => {
    res.send('Posts route');
});

export default app;