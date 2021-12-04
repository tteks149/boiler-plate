const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
var ObjectId = require('mongodb').ObjectId;
//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        privateKey: req.user.privateKey,
        walletAddress: req.user.walletAddress
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);


    // 개인키 생성.
    var sr = require('secure-random')
    var pk = sr.randomBuffer(32)
    user.privateKey = pk.join('/');

    // 코인키 생성 -> 주소 생성
    var CoinKey = require('coinkey')
    var ck = new CoinKey(pk, true) // true => compressed public key / addresses
    user.walletAddress = ck.publicAddress;

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.post('/searchUser', (req, res) => {
    // 유저 검색 
    User.find({ "_id": req.body.userId })
        .exec((err, user) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, user })
        })
})

router.post("/getMedalList", (req, res) => {
    // 유저 칭호 리스트 검색
    User.findOne({ _id: req.body.userId })
        .populate("_id")
        .exec((err, user) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, user });
        });
});


router.post('/deleteUser', (req, res) => {
    // 몽고db 유저 삭제
    User.deleteOne({ "_id": ObjectId(req.body.userId) }
        , function (err, doc) {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true })
        })

});

router.post('/searchUserWalletAdd', (req, res) => {
    // 유저 지갑 주소 검색
    User.find({ "_id": req.body.userId }, 'walletAddress')
        .exec((err, userAdd) => {
            if (err) {
                return res.status(400).send(err);
            }
            console.log(userAdd)
            return res.status(200).json({ success: true, userAdd })
        })
})

router.post('/calcKey', (req, res) => {
    // 키 검증 테스트.

    console.log(req.body.pk);

    var crypto = require("crypto");
    var eccrypto = require("eccrypto");

    var str = req.body.pk;

    var strToKey = str.split('/');

    var buf = new ArrayBuffer(strToKey.length);
    var bufView = new Uint8Array(buf);

    for (var i = 0, strLen = strToKey.length; i < strLen; i++) {
        bufView[i] = strToKey[i]
    }


    var privateKey = Buffer.alloc(bufView.length, bufView, Uint8Array)
    var publicKey = eccrypto.getPublic(privateKey)

    console.log(privateKey)

    console.log(publicKey)
    var str = "message to sign";
    var msg = crypto.createHash("sha256").update(str).digest();

    eccrypto.sign(privateKey, msg).then(function (sig) {

        eccrypto.verify(publicKey, msg, sig).then(function () {

            console.log("Signature is OK");
            return res.status(200).json({ success: true })

        }).catch(function () {

            console.log("Signature is BAD");
            return res.status(400).send(err);
        });
    });


})


module.exports = router;
