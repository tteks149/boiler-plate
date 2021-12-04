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


// 비디오 모든 댓글 삭제
router.post("/deleteVideoComment", (req, res) => {

    Comment.deleteMany({ "postId": ObjectId(req.body.videoId) }
        , function (err, doc) {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true })
        })

});

// 회원 탈퇴시 내가 작성한 모든 댓글 삭제
router.post("/deleteMyComment", (req, res) => {

    Comment.deleteMany({ "writer": ObjectId(req.body.userId) }
        , function (err, doc) {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true })
        })

});

// 내가 쓴 댓글 수정
router.post("/modifyComment", (req, res) => {
    const comment = new Comment(req.body)

    Comment.update({ writer: comment._id }, { $set: { content: comment.content } })
        .exec((err, result) => {
            if (err) return res.json({ success: false, err })
            Comment.find({ 'writer': ObjectId(comment._id) })
                .populate('writer')
                .exec((err, result) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({ success: true, result })
                })
        })
});

// 내가 쓴 댓글 삭제
router.post("/deleteComment", (req, res) => {
    const comment = new Comment(req.body)
    console.log('-----------------------------------------------')
    console.log(req.body)

    comment.deleteOne({ _id: req.body._id }, function (err) {
        // 에러 발생 시, 클라이언트로 에러 전송
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    });
});


module.exports = router;