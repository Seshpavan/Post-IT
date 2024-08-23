import { Schema, model } from "mongoose";

const mediaSchema = new Schema({
    fileId: { type: Schema.Types.ObjectId, required: true },  
    fileType: { type: String, enum: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'], required: true },
    uploadDate: { type: Date, default: Date.now }
});

const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    media: [mediaSchema], 
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
});

export const Post = model('Post', postSchema);
export default Post;
