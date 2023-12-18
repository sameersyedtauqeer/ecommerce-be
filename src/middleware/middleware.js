const jwt = require('jsonwebtoken');
const JWT_SECRET = "qwertyuiopasdfghjkl"


const checkLogin = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    token = token.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token verification failed' });
        }
        req.user = decoded;
        next();
    });
}



module.exports = { checkLogin }
