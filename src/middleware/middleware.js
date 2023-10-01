const jwt = require('jsonwebtoken');
const JWT_SECRET = "qwertyuiopasdfghjkl"


const checkLogin = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ message: "You must be logged in" })
    }
    try {
        const { userID } = jwt.verify(authorization, JWT_SECRET)
        req.user = userID
        next() // Continue to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid" })
    }
}



module.exports = { checkLogin }
