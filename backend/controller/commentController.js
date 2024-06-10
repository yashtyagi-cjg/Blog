const asyncHandler = require('express-async-handler');
const Post = require('./../models/post');
const Comment = require('./../models/comment');
const { validationResult } = require('express-validator');


exports.getCommentsForPost = asyncHandler(
    async(req, res, next)=>{
        var comments = await Comment.find({postId: req.params.id}).populate('authorId').exec();
        //console.log(comments)
        comments = comments.map((comment)=>{
        return {
            authorId: {
                name: comment.authorId.name,
                username: comment.authorId.username,
            },
            comment: comment
        }})

        console.log(comments)
        if(!comments){
            res.status(404).json({message: "Comments not found"});
        }

        res.status(200).json(comments);
    }
)

exports.getCommnetById = asyncHandler(
    async(req, res, next)=>{
        var comment = await Comment.findById(req.params.id)
        .populate('authorId')
        .populate('postId')
        .exec();

        if(!comment){
            return res.status(404).json({message: "Comment not found"})
        }

        comment = {
            authorId: {
                name: comment.authorId.name,
                authorId: comment.authorId._id,
                username: comment.authorId.username,
            },
            ...comment
        }

        res.status(200).json(comment);
        
    }
)

exports.createComment = asyncHandler(

    async(req, res, next)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            console.log(`Comment Createion Validation Errors: ${req.params.id}`)

            return res.status(400).json({message: "Comment creation Unsuccesfully"})
        }
        
        const comment = new Comment({
            comment: req.body.comment,
            authorid: req.body.authorId,
            postId: req.body.postId
        })

        await comment.save();

        res.status(200).json(comment);
    }

)


exports.updateComment = asyncHandler(
    async(req, res, next)=>{

        await Comment.findByIdAndUpdate(req.params.id, {comment: req.body.comment}).exec();

        res.status(200).json({message: "Comment Successfully Updated"});
    }
)

exports.deleteComment = asyncHandler(
    async(req, res, next)=>{
        await Comment.findByIdAndDelete(req.params.id).exec();

        res.status(200).json({message: "Comment Successfully Deleted"});
    }
)