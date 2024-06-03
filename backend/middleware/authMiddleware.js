const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const authenticateToken = asyncHandler(
    async(req, res, next)=>{
        const authHeader = req.header['authorization'];
        const accessToken = authHeader[1];


        jwt.verify(accessToken, process.env.SESSION_SECRET, (err, user)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            console.log(user);
            next();
        })
    }
)