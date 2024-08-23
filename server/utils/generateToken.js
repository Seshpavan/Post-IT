import jwt from 'jsonwebtoken';

// jwt.sign(
//     {email,id:user._id},                 // This is the payload that will be stored in the token. It contains the user's email and id.
//     'secretkey',                         // This is a secret key that must not be shared with anyone else or stored in a public repository. This helps to secure the token.
//     {expiresIn: '1h'},                   // This is the expiration time of the token. It is set to 1 hour.
//     (err, token) => {res.json({token});} // This is the callback function that sends the token to the user.
// );

const generateToken = (user)=> {
    const accessToken = jwt.sign({ id: user._id,username:user.username}, process.env.JWT_SECRET, {expiresIn: '1d'})
    const RefreshToken = jwt.sign({ id: user._id,username:user.username}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
    
    return {accessToken,RefreshToken} 
}

export default generateToken;
