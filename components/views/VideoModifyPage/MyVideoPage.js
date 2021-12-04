import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Icon, Avatar, Typography, Input, Button } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { USER_SERVER } from '../../Config';

//http://localhost
//http://218.54.208.248
const { Title } = Typography;
const { Meta } = Card;
const { Search } = Input;


function MyVideoPage(props) {

    const userId = props.match.params.userId;
    const variable = { userId: userId }
    const [Video, setVideo] = useState([])
    const [User, setUser] = useState([])

    // const [UserImage,setUserImage]=useState("")

    // function onSearch(value){
    // // 링크이동 + 검색 내용 
    // window.location.href=`/video/search/${value}`
    // }


    // 유저의 비디오 검색
    useEffect(() => {

        Axios.post('/api/video/searchUserVideo', variable)
            .then(response => {
                if (response.data.success) {
                    setVideo(response.data.userVideos)
                }
                else {
                    alert('광고 비디오 가져오기 실패')
                }
            })

        Axios.post('/api/users/searchUser', variable)
            .then(response => {
                if (response.data.success) {

                    setUser(response.data.user)


                    // var crypto = require('crypto') //Node.js or Browserify (browser)
                    // var eccrypto = require("eccrypto");
                    // var ecdsa = require('ecdsa')
                    // var sr = require('secure-random') //npm install --save secure-random@1.x
                    // var CoinKey = require('coinkey') //npm install --save coinkey@0.1.0

                    // var str = response.data.user[0].privateKey;

                    // var strToKey = str.split('/');

                    // var buf = new ArrayBuffer(strToKey.length);
                    // var bufView = new Uint8Array(buf);

                    // for (var i = 0, strLen = strToKey.length; i < strLen; i++) {
                    //     bufView[i] = strToKey[i]
                    // }


                    //var privateKey = Buffer.alloc(bufView.length, bufView, Uint8Array)
                    // var privateKey = sr.randomBuffer(32)

                    // var ck = new CoinKey(privateKey, true) // true => compressed public key / addresses
                    // console.log(privateKeyck)

                    // console.log(ck.publicAddress)

                    // var str = "message to sign";
                    // var msg = crypto.createHash("sha256").update(str).digest();


                    // eccrypto.sign(privateKey, msg)

                    //키검증 테스트 넣음
                    // const pk = { pk: response.data.user[0].privateKey}
                    // Axios.post('/api/users/calcKey', pk)
                    //     .then(response => {
                    //         if (response.data.success) {
                    //             console.log("키검증 성공")
                    //         }
                    //         else {
                    //             console.log("키검증 실패")
                    //         }
                    //     })

                    // var crypto = require("crypto");
                    // var eccrypto = require("eccrypto");

                    // var str = response.data.user[0].privateKey;

                    // var strToKey = str.split('/');

                    // var buf = new ArrayBuffer(strToKey.length);
                    // var bufView = new Uint8Array(buf);

                    // for (var i = 0, strLen = strToKey.length; i < strLen; i++) {
                    //     bufView[i] = strToKey[i]
                    // }


                    // var privateKey = Buffer.alloc(bufView.length, bufView, Uint8Array)
                    // var publicKey = eccrypto.getPublic(privateKey)

                    // console.log(privateKey)

                    // console.log(publicKey)

                }
                else {
                    alert('유저 정보 가져오기 실패')
                }
            })



    }, [])

    const deleteUser = (e) => {

        if (window.confirm("정말로 탈퇴 하시겠습니까??? \n(주의! 업로드한 영상이 모두 삭제됩니다!) ")) {
            // 삭제 확인 

            // 먼저 업로드한 비디오 삭제
            if (Video) // 올린 비디오가 있으면
            {
                for (var i = 0; i < Video.length; i++) {


                    const videoVariables = {
                        videoId: Video[i]._id,
                        url: Video[i].filePath,
                        thumbnail: Video[i].thumbnail,
                        userId: User._id
                    }

                    // 먼저 서버 upload 경로 동영상 파일을 삭제
                    Axios.post('/api/video/deleteVideoFile', videoVariables)
                        .then(response => {
                            if (response.data.success) {

                                // 서버 해당 동영상의 썸네일 파일을 삭제
                                Axios.post('/api/video/deleteVideoThumbnailFile', videoVariables)
                                    .then(response => {
                                        if (response.data.success) {

                                            //DB의 동영상 댓글 삭제
                                            Axios.post('/api/comment/deleteVideoComment', videoVariables)
                                                .then(response => {
                                                    if (response.data.success) {

                                                        //DB의 동영상 데이터 삭제
                                                        Axios.post('/api/video/deleteVideo', videoVariables)
                                                            .then(response => {
                                                                if (response.data.success) {

                                                                    // 삭제 성공 따로 메시지는 출력 x
                                                                } else {
                                                                    alert(`동영상 삭제에 실패했습니다.`)
                                                                }
                                                            })

                                                    } else {
                                                        alert(`동영상 댓글 삭제에 실패했습니다.`)
                                                    }
                                                })

                                        } else {
                                            alert(`서버 동영상 썸네일 삭제에 실패했습니다.`)
                                        }
                                    })

                            } else {
                                alert(`서버 동영상 파일 제거에 실패했습니다.`)
                            }
                        })

                }
            }

            // 유저 데이터 삭제

           
            //내가올린 댓글들 삭제
            Axios.post('/api/comment/deleteMyComment', variable)
                .then(response => {
                    if (response.data.success) {

                        // 삭제 성공 따로 메시지는 출력 x
                    } else {
                        alert(`댓글 삭제에 실패했습니다.`)
                    }
                })
                
            // db 유저 데이터 삭제
            Axios.post('/api/users/deleteUser', variable)
                .then(response => {
                    if (response.data.success) {

                    }
                    else {
                        alert('유저 데이터 삭제 실패')
                    }
                })

            // 로그아웃
            Axios.get(`${USER_SERVER}/logout`).then(response => {
                if (response.status === 200) {
                    props.history.push("/login");
                } else {
                    alert('로그아웃 실패')
                }

            });



        }
        else {
            // 삭제 취소.. 아무것도 안함 
        }
    }


    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24}>

            <div style={{ position: 'relative' }}>
                <a href={`/video/modify/modifyVideo/${video._id}`}>
                    <img style={{ width: '100%' }} src={`http://218.54.208.248:5000/${video.thumbnail}`}></img>
                    <div className="duration">
                        <span>{minutes} : {seconds} </span>
                    </div>
                </a>
            </div>

            <br />
            <Meta
                title={video.title}
                description={video.description}
            />
            <span style={{}}>조회수 {video.views}  </span> - <span>{moment(video.createdAt).format("MM Do YYYY")}</span>
        </Col>
    })

    const renderUser = User.map((user, index) => {

        return <Col lg={6} md={8} xs={24} style={{ width: '100%' }}>
            <div style={{ width: '30%', float: 'left' }}>

                <img style={{ width: '70%' }} src={user.image}></img>
            </div>
            <div style={{ width: '70%', float: 'left' }}>
                <span style={{}}>이름: {user.name}  </span> <br />
                <span style={{}}>칭호: {user.medal}  </span> <br />
            </div>
            <br />
        </Col>
    })

    if (User) {
        return (

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <Title level={2} > 내 채널 정보 </Title>
                <hr />
                <Row gutter={[32, 16]} >
                    {renderUser}
                </Row>
                <br />
                <br />
                <Title level={2} > 내 동영상 </Title>
                <hr />
                <Row gutter={[32, 16]}>
                    {renderCards}
                </Row>


                <br />
                <br />
                <hr />
                <Button type="danger" size="large" onClick={deleteUser} style={{ marginLeft: '1rem' }}>
                    회원 탈퇴
                </Button>

            </div>
        )

    } else {
        return (
            <div> ....로딩중입니다 </div>
        )
    }

}
export default MyVideoPage