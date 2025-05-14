const express = require('express');
const router = express.Router();

const Comment = require("../model/comment.model")

module.exports = router;

//create a comment

router.post('/post-comment',async(req,res) => {

   try{
    console.log(req.body)
    const newComment = new Comment(req.body)
    await newComment.save();
    res.status(200).send({
        message:"Comment created succefully",
        comment : newComment
    })
   }catch(error){
    console.error("An error occured while posting the comment",error);    
    res.status(500).send({
        message:"AN error occured while posting the comment:"
    })
   }

}) 


/// get all comments count

router.get("/total-comments",async(req,res) =>{
    try{
        const totalComment = await Comment.countDocuments({}
        );
        res.status(200).send({
            message:"Total comments count",
            totalComment
        })
       }catch(error){
        console.error("An error occured while fetching the comment count",error);    
        res.status(500).send({
            message:"AN error occured while fetching the comment count"
        })
       }

})



module.exports = router;