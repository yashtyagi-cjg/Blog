const asyncHandler = require('express-async-handler');
const Post = require('./../models/post');
const Comment = require('./../models/comment');
const { validationResult } = require('express-validator');


//GEt all the post (pagination to be implemented)
exports.getAllPosts = asyncHandler(
    async(req, res, next)=>{
        const allPosts = await Post.find({}).populate('authorId').exec();

        if(!allPosts){
            return res.status(200).json({message: "No Posts Found" });
        }
        const posts = allPosts.map((post)=>{
            return {
                heading: post.heading,
                content: post.content,
                author: {
                    name: post.authorId.name,
                    username: post.authorId.username 
                },
                createdDate: post.createdAt,
                updatedDate: post.updatedAt,
                postId: post._id,
                comments: post.comments
            }
        })

        res.status(200).json(posts);
    }
    
)


//Get a single post by using Id
exports.getPostById = asyncHandler(
    async(req, res, next)=>{
        const post = await Post.findById(req.params.id).populate('authorId').exec();

        if(!post){
            return res.status(404).json({message: "Post not Found"});
        }

        const response = {
            heading: post.heading,
            content: post.content,
            author: {
                name: post.authorId.name,
                username: post.authorId.username 
            },
            createdDate: post.createdAt,
            updatedDate: post.updatedAt,
            postId: post._id,
            comments: post.comments
        }

        res.status(200).json(response);
    }
)


//Create Posts
exports.createPost = asyncHandler(
    async(req, res, next)=>{
        // const error = validationResult(req);
        // //authorId
        // if(!error){
        //     return res.status(400).json({message: "Bad Request"});
        // }
        console.log("Request to create POST")
        console.log("Request Headers:", JSON.stringify(req.headers, null, 2));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("Request Query Params:", JSON.stringify(req.query, null, 2));
        console.log("Request Params:", JSON.stringify(req.params, null, 2));


        const post = new Post({
            heading: req.body.heading,
            content: req.body.content,
            authorId: req.body.authorId,
        })

        await post.save().catch((err)=>{
            console.log(`ERROR while createing post: ${err}`);

            return res.status(500).json({message: "Post not Created"});
        })

        res.status(200).json({message: "Post created"});
    }
)


//Update the Post
exports.updatePost = asyncHandler(
    async(req, res, next)=>{
        const updatedPost = {
            heading: req.body.heading,
            content: req.body.content,
            updatedAt: Date.now()
        }

        await Post.findByIdAndUpdate(req.params.id, updatedPost).exec().catch((err)=>{
            console.log(err);
            return res.status(400).json({message: "Post not updated"});
        })

        res.status(200).json({message: "Post updated successfully"});
    }
)


// Delete Post and all the comments associated with that post
exports.deletePost = asyncHandler(
    async(req, res, next)=>{
        const post = await Post.findById(req.params.id).populate('comments').exec();

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }


        const commentIds = post.comments.map(comment=>comment._id)

        await Comment.deleteMany({_id:{$in: commentIds}}).exec().catch((err)=>{
            console.log(`Error while deleting comments for Post Ids ${req.params.id}`)
            return res.status(500).json({message: "Post not deleted"})
        })

        await Post.findByIdAndDelete(req.params.id).exec().catch((err)=>{
            console.log(`Comments successfully deleted.`)
            console.log(`Error while deleting the postId: ${req.params.id}`)
            console.log(`Error: ${err}`);
            res.status(500).json("Associated comments deleted")
        })

        res.status(200).json({message: "Post Successfully deleted"})

    }
)


exports.addCommentToPost = asyncHandler(
    async(req, res, next)=>{
        const newComment = new Comment({
            comment: req.body.comment,
            authorId: req.body.authorId,
            postId: req.params.id,
        })

        await newComment.save();

        res.status(200).json({message: "Comment Added"})
    }
)