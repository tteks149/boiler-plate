const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

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
        cb(null, true)
    },
});

const upload = multer({ storage: storage}).single("file");


//=================================
//             video
//=================================



router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장
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


router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보냄

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if ( err ) return res.status(400).send(err);
            res.status(200).json({success:true , videos})
        })
})


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
        count: 3,
        folder: 'uploads/thumbnails', 
        size: '320x240',
        filename: 'thumbnail-%b.png' 
    })

    
})


module.exports = router;
