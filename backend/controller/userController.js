const {body, validationResult} = require('express-validator')
const asyncHandler = require('express-async-handler')
const User = require('./../models/user')


exports.getAllUsers = asyncHandler(
    async (req, res, next)=>{
        const Users = await User.find({}).sort({username: 1}).exec();

        const result = Users.map((user)=>{
            return {
                name: user.name,
                username: user.username
            }
        })

        res.json(result);
    }
)

exports.getUserById = asyncHandler(
    async(req, res, next)=>{
        const currUser = await User.findById(req.params.id).exec();

        if(!currUser){
            return res.status(404).json({message: "User not Found"});
        }
        res.json({
            user: currUser.name,
            username: currUser.username
        })
    }
)

exports.updateUser = asyncHandler(
    async(req, res, next)=>{

        const currUser = {
            name: req.body.name,
            username: req.body.username
        }

        console.log(currUser);

        await User.findByIdAndUpdate(req.params.id, currUser).exec().catch((err)=>{
            return res.status(500).json({message: "Error while updating the user"})
        })

        res.status(200).json({message: "User updated"})
    }
)

exports.deleteUser = asyncHandler(
    async(req, res, next)=>{
        await User.findByIdAndDelete(req.params.id).exec().catch((err)=>{
            res.status(400).json({message: "Error Encountered"})
        })

        res.status(200).json(
            {
                message: "User deleted successfully"
            }
        )
    }
)