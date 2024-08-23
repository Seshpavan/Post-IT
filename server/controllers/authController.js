import bcrypt from 'bcrypt';
import  passport from 'passport';
import generateTokens from '../utils/generateToken.js';

import User from '../models/user-model.js';        // This User will have { create, find, findOneAndUpdate, findOneAndDelete }
import generateToken from '../utils/generateToken.js';


// UPDATE!: HANDLE ALL THE ERROR SO THAT THE SERVER DOESN'T CRASH AND STOPS THE FLOW OF THE USER


export async function registerUser(req, res) {
    try {
        const { name, email, username, password } = req.body;

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).send("User already exists");
        };

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                // if (err) return res.send(err.message);
                if (err) console.log(err.message);
                else {
                    const user = await User.create({
                        name,
                        email,
                        username,
                        password: hash,
                    })
                    res
                    .status(201)
                    .send("User Registered Successfully");
                }
            })
        })
    } catch (err) {
        console.log(err.message);
    }
}

export async function loginUser(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: 'An error occurred during authentication.', error: err.message });
            }
            if (!user) {
                return res.status(401).json({ message: info.message || 'Login failed.' });
            }
    
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Login failed.', error: err.message });
                }
    
                const tokens = generateTokens(req.user);
                res.cookie('accessToken', tokens.accessToken, { 
                    httpOnly: true, 
                    // secure: true, 
                    // sameSite: 'None', 
                    sameSite: 'Strict', 
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                });
                res.cookie('refreshToken', tokens.RefreshToken, { 
                    httpOnly: true, 
                    // secure: true, 
                    // sameSite: 'None', 
                    sameSite: 'Strict', 
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                return res.json({ message: 'Login successful', userData: req.user });
            });
        })(req, res, next);
};


