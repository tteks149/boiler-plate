
const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");

const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
var ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }, 
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)

        if(ext !== '.mp4'){
            return cb(res.status(400).end('mp4 파일만 가능합니다') , false);
        }
        else {
            return cb(null, true)
        }
    },
});

const upload = multer({storage: storage}).single("file");


// ------------------- video 

router.post('/searchVideo', (req, res) => {
    // 비디오 검색
    console.log(req.body.title)
    Video.find({ "title":{$regex:req.body.title} ,"isAdv":0 , "privacy" : 1})
        .populate('writer')
        .exec((err, videos) => {
            if ( err ){
                return res.status(400).send(err);
            } 
            return res.status(200).json({success:true , videos})
        })
})

router.post('/searchUserVideo', (req, res) => {
    console.log(req.body.userId)
    // 유저의 비디오 검색 
    Video.find({ "writer":req.body.userId})
        .populate('writer')
        .exec((err, userVideos) => {
            if ( err ){
                return res.status(400).send(err);
            } 
            return res.status(200).json({success:true , userVideos})
        })
})


router.post('/uploadfiles', (req, res) => {
    // 비디오 mp4 파일을 서버에 저장
    upload(req,res, err=> {
        if(err) {
            return res.json( { success: false, err})
        }
        return res.json({success: true, url: res.req.file.path, fileName:res.req.file.fieldname})
    })
})


router.post('/uploadVideo', (req, res) => {
    // 비디오를 몽고 db에 저장

    const video = new Video(req.body)

    video.save((err,doc) => {
        if(err) return res.json ( { success: false , err })
        res.status(200).json({success: true})
    })
})


router.post('/modifyVideo', (req, res) => {
    // 비디오 수정
    
    Video.updateOne( {"_id" : ObjectId(req.body.videoId)}  , 
        { $set :  { 
        "title": req.body.title,
        "description":req.body.description,
        "privacy":req.body.privacy,
        "category":req.body.category
    }},function(err, doc){
        if(err) return res.json ( { success: false , err })
        res.status(200).json({success: true})
    })
});


router.post('/deleteVideo', (req, res) => {
    // 몽고db 비디오 삭제
    Video.deleteOne( {"_id" : ObjectId(req.body.videoId)}  
    ,function(err, doc){
        if(err) return res.json ( { success: false , err })
        res.status(200).json({success: true})
    })
    
});

router.post('/deleteVideoFile', (req, res) => {
    // 서버의 비디오  파일 삭제
    fs.unlink(req.body.url , err =>{
        if ( err){
            console.log("비디오 파일 삭제 에러 발생")
            console.log(err)
            return res.json ( { success: false , err })
        }
        else{
            return res.json ( { success: true })
        }
    })
   
});

router.post('/deleteVideoThumbnailFile', (req, res) => {
    // 서버의 비디오 썸네일 파일 삭제
    fs.unlink(req.body.thumbnail , err =>{
        if ( err){
            console.log("비디오 썸네일 파일 삭제 에러 발생")
            console.log(err)
            return res.json ( { success: false , err })
        }
        else{
            return res.json ( { success: true })
        }
    })
   
});

router.post('/uploadAdverVideo', (req, res) => {
    // 광고 비디오를 몽고 db에 저장

    const video = new Video(req.body)

    video.save((err,doc) => {
        if(err) return res.json ( { success: false , err })
        res.status(200).json({success: true})
    })
})


router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보냄

    Video.find({"isAdv":0 , "privacy" : 1})
        .populate('writer')
        .exec((err, videos) => {
            if ( err ) return res.status(400).send(err);
            res.status(200).json({success:true , videos})
        })
})



router.post('/getVideoDetail', (req, res) => {
    // 비디오 정보(영상, 작성자등..) 가져오기 + 조회수 1증가 
   
    Video.findOne({"_id":req.body.videoId}) // 클라이언트 보낸 videoId를 넣어서 찾음
        .populate('writer') // id 작성자의 모든 정보 들고옴
        .exec((err, videoDetail) => {

            // 조회수 1 증가후 DB저장. 그 후 리턴.
            videoDetail.views++;
            videoDetail.save();

            if(err) return res.status(400).send(err);
            return res.status(200).json({success: true , videoDetail})
            

        }) 
        
        
      
})

// router.post('/getAdverVideo', (req, res) => {
//     // 광고 비디오 정보 가져오기 
    
//     Video.findOne({"isAdv":1}) // 광고 동영상 
//         .populate('writer') // 광고 작성자의 모든 정보 들고옴
//         .exec((err, adverVideo) => {
//             if(err) return res.status(400).send(err);
//             return res.status(200).json({success: true , adverVideo})

//         }) 
// })

router.post('/getRandomAdverVideo', (req, res) => {
    // 랜덤한 광고 비디오 정보 가져오기 + 조회수 1 증가 시킴

    Video.aggregate([{'$match': {'isAdv': 1}}, {'$sample': {'size': 1 }}])
    .exec((err, adverVideo) => {
        
        //console.log(adverVideo[0].title)
        // 조회수 1 증가
        adverVideo[0].views++
       
        // 여기선 save 안되고,  updateOne이 작동함. aggregate 리턴이 배열이라서 그런거같음
        Video.updateOne( {"_id" : ObjectId(adverVideo[0]._id)} ,
            { $set :  { 
            "views": adverVideo[0].views
            }}
            ,function(err, doc){
                if(err) return res.json ( { success: false , err })
            }
        )
        
        if(err) return res.status(400).send(err);
        return res.status(200).json({success: true , adverVideo})

    })
    
})

// router.post('/getRandomAdverVideo', (req, res) => {
//     // 랜덤한 광고 비디오 정보 가져오기

//     Video.aggregate([{'$match': {'isAdv': 1}}, {'$sample': {'size': 1 }}])
//     .exec((err, adverVideo) => {

//         if(err) return res.status(400).send(err);
//         return res.status(200).json({success: true , adverVideo})

//     })
    
// })



router.post('/thumbnail', (req, res) => {
    // 비디오 썸네일 생성 후, 비디오 러닝타임 가져오기
    
    let filePath = ""
    let fileDuration = ""

    // 비디오 러닝타임 생성
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })


    // 비디오 썸네일 생성
    ffmpeg(req.body.url) //  uploads 비디오 저장 경로
    .on('filenames', function(filenames){   // 비디오 썸네일 파일 생성
        console.log('will generate ' + filenames.join(', '));
        console.log(filenames);

        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function() { // 썸네일 생성 성공
        console.log('스크린샷 받음'); 
        return res.json( { success: true, url: filePath, fileDuration: fileDuration});
    })
    .on('error', function(err) {    // 에러 발생
        console.error(err);
        return res.json({success:false, err});
    })
    .screenshots( {
        count: 1,
        folder: 'uploads/thumbnails', 
        size: '320x240',
        filename: 'thumbnail-%b.png' 
    })

    
})


module.exports = router;
