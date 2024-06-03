const User = require('./../models/user')
const Token = require('./../models/token')
const Comment = require('./../models/comment')
const{v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

const generateAccessTokens = (user)=>{
    return jwt.sign({user: user.id}, process.env.SESSION_SECRET, {expiresIn: '15m'})
}

const generateRefreshTokens = (user)=>{
    const refreshToken = uuidv4();

    const token = new Token({
        token: refreshToken,
        userId: user._id,
    })

    token.save();

    return refreshToken;
}

exports.signup = asyncHandler(  
    async(req, res, next)=>{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            hash: hashedPassword,
        })

        await newUser.save().catch((err)=>{
            console.log(`Error during sing up of ${req.body.name}`)
            console.log(`Error: ${err}`)
            return res.status(400).json({message: "User not Creatred"});
        })

        res.status(201).json({message: 'User created'});
    }
)


exports.login = asyncHandler(
  
        async(req, res, next)=>{
            console.log(req.body)
            const user = await User.findOne({username: req.body.username}).exec();

            if(!user){
                return res.status(404).message({message: "Incorrect Password/Username"});
            }

            if(await bcrypt.compare(req.body.password, user.hash)){
                const accessToken = generateAccessTokens(user);
                const refreshToken = generateRefreshTokens(user);

                res.status(200).json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                })
            }else{
                res.status(404).json({message: "Incorrect Password/Username"});
            }
        }
    
)

exports.logout = asyncHandler(
    async(req, res, next)=>{
        const token = req.body.token;
        await Token.findOneAndDelete({token}).exec();

        res.status(200).json({message: "Successfully Logged Out"});
    }
)


exports.refreshToken = asyncHandler(
    async(req, res, next)=>{
        const token = req.body.token;
        if(!token){
            return res.status(401);
        }

        const user = await User.findById(token.userId)
        const generatedAccessToken = generateAccessTokens(user);

        res.json({accessToken: generatedAccessToken})
    }
)