import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import Comment from './Sections/Comment';
import { useSelector } from 'react-redux';

//http://218.54.208.248:5000
//http://localhost:5000
function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }


    const [VideoDetail, setVideoDetail] = useState([])
    const [AdverVideo, setAdverVideo] = useState([])
    const [Comments, setComments] = useState([])

    const user = useSelector(state => state.user);

    useEffect(() => {
        //getRandomAdverVideo
        //getAdverVideo
        Axios.post('/api/video/getRandomAdverVideo')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setAdverVideo(response.data.adverVideo)
                }
                else {
                    alert('광고 비디오 가져오기 실패')
                }
            })

        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                }
                else {
                    alert('비디오 디테일 정보 가져오기 실패')
                }
            })

        // 댓글 가져오기
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if (response.data.success) {

                    setComments(response.data.comments)
                }
                else {
                    alert('코멘트 정보를 가져오는 것을 실패하였습니다.')
                }
            })

    }, [])

    function endAdver() {
        //광고 끝나면 생기는 이벤트
        document.getElementById("adverVideo").style.display = "none"
        document.getElementById("video").style.display = "inline"

        if (user.userData.walletAddress )
        {
            var userWalletAddress = user.userData.walletAddress;
            console.log(userWalletAddress)
    
            let ws = new WebSocket("ws://114.202.114.196:3000/wsForChat?openPort=3000");
    
    
            ws.onopen = (event) => {
                console.log("웹소켓 연결 성공")
    
                var sendDataInitial = 3;
                var sendData = userWalletAddress;
    
                console.log(sendData);
    
                ws.send(sendDataInitial);
                ws.send(sendData);
                ws.close();
            }

        }
        else{
            console.log("로그인 안해서 코인 못줌")
        }
       



    }

    const refreshFunction = (newComment) => {

        setComments(Comments.concat(newComment))
    }

    const refreshAllFunction = () => {
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if (response.data.success) {

                    setComments(response.data.comments)
                }
                else {
                    alert('코멘트 정보를 가져오는 것을 실패하였습니다.')
                }
            })
    }

    if (VideoDetail.writer) {
        if (user.userData) {
            return (
                <Row gutter={[16, 16]}>

                    <Col lg={18} xs={24}>
                        <div style={{ width: '100%', padding: '3rem 4rem' }}>

                            <video id="adverVideo" style={{ width: '700px', height: '393px', display: 'inline' }} src={`http://218.54.208.248:5000/${AdverVideo[0].filePath}`} autoPlay controls onEnded={endAdver} />
                            <video id="video" style={{ width: '700px', height: '393px', display: 'none' }} src={`http://218.54.208.248:5000/${VideoDetail.filePath}`} controls />



                            <List.Item
                                actions //좋아요, 구독
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image} />}
                                    title={VideoDetail.title}
                                    description={VideoDetail.description}
                                />
                            </List.Item>

                            <Comment refreshFunction={refreshFunction} refreshAllFunction={refreshAllFunction} commentLists={Comments} postId={VideoDetail._id} />
                        </div>
                    </Col>

                </Row>
            )
        } else {
            return (
                <div> ....로딩중입니다 </div>
            )
        }

    } else {
        return (
            <div> ....로딩중입니다 </div>
        )

    }



}

export default VideoDetailPage
