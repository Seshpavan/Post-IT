import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    MyPosts: {
        type: Array,
        default: []
    },
    friendRequests: [
        {
            senderId: { type: Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    friends: {
        type: Array,
        default: []
    },

    // UPDATE!: MAY OR MAY NOT ADD
    // MyStories: {
    //     type: Array,
    //     default: []
    // },
    UserDP: String,
});

export default model('User', userSchema);