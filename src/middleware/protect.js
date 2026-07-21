const jwt = require('jsonwebtoken')

function protect(req, res, next){
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization']

    // Check if the token is present and starts with 'Bearer '
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1]

    try{
        // Verify the token - throws if invalid or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Attach user info to request
        req.user = { userId: decoded.userId}

        //pass control to next handler
        next()
    } catch(err){
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }
}

module.exports = protect