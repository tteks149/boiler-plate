const express = require('express');
const router = express.Router();
const { Medal } = require("../models/Medal");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { response } = require('express');
var ObjectId = require('mongodb').ObjectId;

//=================================
//             Medal
//=================================

router.post('/uploadMedal', (req, res) => {
    //칭호 정보 저장
    const medal = new Medal(req.body)

    medal.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })

})
router.get('/getMedals', (req, res) => {
    //DB에서 칭호목록 가져오기
    Medal.find()
        .populate('writer')
        .exec((err, medals) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, medals })
        })

})
router.post('/getMedalDetail', (req, res) => {
    //DB에서 칭호 가져오기
    Medal.findOne({"_id" : req.body.medalId})
    .populate('userId')
    .exec((err,medalDetail) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true,medalDetail})
    })
})

router.post('/updateUsersMedal', (req, res) => {
    //DB에서 사용자의 현재 medal 변경, Medal 객체의 count 증가, User객체의 medalList에 구매내역 추가
    User.updateOne({"_id" : req.body.userId},
    {$set : {"medal" : req.body.medalTitle}}
    ,function(err){
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true})
    })

    Medal.updateOne({"_id" : req.body.medalId},
    {$inc : {"count" :  "1"}}
    ,function(err){
        if(err) return res.status(400).send(err)
    })
    User.findOne({ "_id" : req.body.userId}, (err, user) => {
      user.addMedal(req.body.medalId,req.body.medalTitle)
      ,function(err){
        if(err) return res.status(400).send(err)
      }
    });
})
router.post('/deleteMedal',(req,res)=>{
//DB에서 지정한 Medal 삭제
    Medal.deleteOne({"_id":ObjectId(req.body.medalId)}
    ,function(err){
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true})
    })
})
router.post('/updateMedal', (req, res) => {
    //DB에서 사용자의 현재 medal 변경, Medal 객체의 count 증가, User객체의 medalList에 구매내역 추가
    Medal.updateOne({"_id" : req.body.medalId},
    {$set : {
        "name" : req.body.medalName,
        "price":req.body.medalPrice},
        "description":req.body.medalDescription
    }
    ,function(err){
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true})
    })
});
module.exports = router;