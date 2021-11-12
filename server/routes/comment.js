const express = require('express');
const router = express.Router();

const { Comment } = require("../models/Comment")

const { auth } = require("../middleware/auth");
var ObjectId = require('mongodb').ObjectId;

router.post("/saveComment", (req, res) => {

    const comment = new Comment(req.body)
    console.log(comment)

    comment.save((err, comment) => {

        if (err) {
            console.log("save 에러")
            return res.json({ success: false, err })
        }
       
        Comment.find({ '_id': ObjectId(comment._id) })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result })
            })
    })
});

router.post("/getComments", (req, res) => {

    Comment.find({ "postId": req.body.videoId })
        .populate('writer')
        .exec((err, comments) => {

            if (err) {
                return res.status(400).send(err);
            }
            else {
                return res.status(200).json({ success: true, comments })
            }


        })
});

module.exports = router;