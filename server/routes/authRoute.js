import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const app = Router();

app.post('/register', registerUser);



app.post('/login', loginUser);



app.post('/logout', (req, res) => {
    try {
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('refreshToken', { path: '/' });
        res.clearCookie('connect.sid', { path: '/' });
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Failed to log out');
            }
            res.status(200).send('Logged out successfully');
        });
    } catch (err) {
        console.log(err);
    }
});

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ user: req.user });
});

export default app;
