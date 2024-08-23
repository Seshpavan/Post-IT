import User from '../models/user-model.js';
import Post from '../models/post-model.js'

import { gfsBucket } from '../config/mongooseConnection.js';
import { Readable } from 'stream';
import mongoose from 'mongoose';

export async function createPost(req, res) {
    try {
        const postText = req.body.text;
        const mediaFiles = req.files;

        if (!mediaFiles || mediaFiles.length === 0) {
            console.log('No files provided');
            return res.status(400).json({ message: 'No files provided' });
        }

        console.log('Number of files:', mediaFiles.length);

        const fileUploadPromises = mediaFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const readableStream = new Readable();
                readableStream.push(file.buffer);
                readableStream.push(null);

                const uploadStream = gfsBucket.openUploadStream(file.originalname, { contentType: file.mimetype });

                readableStream.pipe(uploadStream);

                uploadStream.on('finish', () => {
                    resolve({
                        fileName: file.originalname,
                        fileId: uploadStream.id,
                        fileType: file.mimetype
                    });
                });

                uploadStream.on('error', (error) => {
                    console.error('Error Uploading file:', file.originalname, error);
                    reject({ fileName: file.originalname, error });
                });
            });
        });


        if (fileUploadPromises.length === 0) {
            console.log('No valid files to upload');
            return res.status(400).json({ message: 'No valid files to upload' });
        }


        Promise.all(fileUploadPromises)
            .then(async (results) => {
                const uploadedMedia = results.map(result => ({
                    fileId: result.fileId,
                    fileName: result.fileName,
                    fileType: result.fileType 
                }));

                const newPost = new Post({
                    userId: req.user._id,
                    caption: postText,
                    media: uploadedMedia 
                });

                await newPost.save();

                await User.updateOne({ _id: req.user._id }, { $push: { MyPosts: newPost._id } });

                res.status(200).json({ message: 'Files uploaded successfully', files: results });
            })
            .catch((error) => {
                console.error('Error uploading files:', error);
                res.status(500).json({ message: `Error uploading file: ${error.fileName}`, error: error.error });
            });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
}

export async function getMedia(req, res) {
    try {
        const fileId = req.params.fileId;

        const files = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No file found' });
        }

        const file = files[0];
        const readStream = gfsBucket.openDownloadStream(file._id);

        res.set('Content-Type', file.contentType);
        readStream.pipe(res);

        readStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            res.status(500).json({ message: 'Error streaming file' });
        });
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ message: 'Error retrieving file' });
    }
}