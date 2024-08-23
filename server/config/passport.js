import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// import GoogleStrategy from 'passport-google-oauth2';
import { compare } from 'bcrypt';
import User from '../models/user-model.js';

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: 'User does not exist.' });

            const isMatch = await compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
            user.password = undefined;
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// passport.use("google" , new GoogleStrategy({
//     clientID: process.env.O_AUTH_CLIENT_ID,
//     clientSecret: process.env.O_AUTH_CLIENT_SECRET,
//     callbackURL:"http://localhost:5173/home",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     passReqToCallback: true,
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const user = await User.findOne({ googleId: profile.id });
//         if (user) {
//             return done(null, user);
//         }

//         const newUser = new User({
//             googleId: profile.id,
//             username: profile.displayName,
//             email: profile.email,
//             profilePic: profile.picture,
//         });
//         await newUser.save();
//         done(null, newUser);
//     } catch (err) {
//         done(err);
//     }
// }));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
