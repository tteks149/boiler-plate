import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import Comment from './Sections/Comment';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }


    const [VideoDetail, setVideoDetail] = useState([])
    const [AdverVideo, setAdverVideo] = useState([])
    const [Comments, setComments] = useState([])



    useEffect(() => {
        console.log(props)
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
        //alert("광고끝. 코인이벤트 발생")
    }

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }


    if (VideoDetail.writer) {
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

                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={VideoDetail._id} />

                    </div>
                </Col>

            </Row>



        )
    } else {
        return (
            <div> ....로딩중입니다 </div>
        )

    }



}

export default VideoDetailPage
