import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
import generateToken from '../utils/generateToken.js';


export const verifyToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        if (!refreshToken) {
            return res.status(401).json({ message: 'Both access and refresh tokens are missing' });
        }

        // Attempt to refresh the token
        try {
            const newToken = await refreshTokenFunc(refreshToken);

            // Set the new access token in the cookie
            res.cookie('accessToken', newToken.accessToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000, // 15 minutes
            });
            res.cookie('refreshToken', newToken.RefreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 15 minutes
            });

            // Continue with the new access token
            req.user = jwt.verify(newToken.accessToken, process.env.JWT_SECRET);
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Failed to refresh token' });
        }
    }


    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Token is invalid or expired, attempt to refresh
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is missing' });
        }

        try {
            console.log("refreshToken inside try block", refreshToken);
            const newTokens = await refreshTokenFunc(refreshToken);

            // Set the new access token in the cookie
            res.cookie('accessToken', newTokens.accessToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.cookie('refreshToken', newTokens.RefreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            req.user = jwt.verify(newTokens.accessToken, process.env.JWT_SECRET);
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Failed to refresh token' });
        }
    }
};


export async function refreshTokenFunc(refreshToken) {
    if (!refreshToken) {
        throw new Error('Refresh token is missing');
    }
    
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        return generateToken(user);
    } catch (error) {
        console.log("error", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}


