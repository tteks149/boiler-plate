import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Icon, Avatar, Typography, Input } from 'antd';
import Axios from 'axios';
import moment from 'moment';
//http://localhost
//http://218.54.208.248
const { Title } = Typography;
const { Meta } = Card;
const { Search } = Input;

// const onSearch = value => console.log(value);

function onSearch(value){
    // 링크이동 + 검색 내용
    window.location.href=`/video/search/${value}`
}

function LandingPage() {

    const [Video, setVideo] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    setVideo(response.data.videos)
                } else {
                    alert('서버에서 비디오 가져오기를 실패 했습니다.')
                }
            })

    }, [])

    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24}>

            <div style={{ position: 'relative' }}>
                <a href={`/video/${video._id}`}>
                    <img style={{ width: '100%' }} src={`http://218.54.208.248:5000/${video.thumbnail}`}></img>
                    <div className="duration">
                        <span>{minutes} : {seconds} </span>
                    </div>
                </a>
            </div>

            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.medal} {video.writer.name} </span> <br />
            <span style={{ marginLeft: '3rem' }}>조회수 {video.views} 회 </span> - <span>{moment(video.createdAt).format("YYYY년 MM월 DD일")}</span>
        </Col>
    })

    return (


        <div style={{ width: '85%', margin: '1rem auto' }}>
            
           <Search 
                placeholder="검색" 
                enterButton 
                size="default"
                allowClear
                onSearch={onSearch} 
           />

            <hr />
            <Title level={2} > 전체 </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}

            </Row>

        </div>
    )
}

export default LandingPage
