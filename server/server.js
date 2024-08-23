// Packages
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer";
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";
import session from 'express-session';
import MongoStore from 'connect-mongo';

// import helmet from "helmet";
// import morgan from "morgan";
// import flash from 'connect-flash';


// Database
import { connectDB} from './config/mongooseConnection.js';


// Config
import passport from './config/passport.js';


// Routes
import postRoute from './routes/postsRoute.js';
import authRoute from './routes/authRoute.js';

// Controllers
import { createPost, getMedia } from './controllers/postController.js';

// Middleware Imports
import { verifyData } from './middlewares/authMiddleware.js';
import { refreshTokenFunc, verifyToken } from './middlewares/jwtMiddleware.js';

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const corsOptions = {
    origin: 'http://localhost:5173', // frontend origin location
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};


// Middleware calls
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, // We can save the in the mongodb store if we wanted to and even when we updating or restarting the server the session will not be lost 
        saveUninitialized: false,  // This is to save the session in the store only when the user is logged in
        store: MongoStore.create({ mongoUrl: process.env.LOCAL_DB }),
    })
);

app.use(passport.initialize());
app.use(passport.session());


// DATABASE CONNECTION
connectDB();



const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
        fieldSize: 50 * 1024 * 1024,
    },
});


// ROUTES 
app.use('/api/auth', authRoute);
app.use('/api/posts', verifyToken ,postRoute);
// app.use('/api/posts', postRoute);



// Refresh Token
app.post('/api/refresh-token', refreshTokenFunc);

// Create a new post
app.post('/api/create-post', verifyData, upload.array('media'), createPost);

// Get media file
app.get('/api/media/:fileId', getMedia);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
