import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Icon, Avatar, Typography, Input, } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
//http://localhost
//http://218.54.208.248
const { Title } = Typography;
const { Meta } = Card;
const { Search } = Input;
//const onSearch = value => console.log(value);


function MyVideoPage(props) {

    const userId = props.match.params.userId;
    const variable = {userId: userId }
    const [Video, setVideo] = useState([])

    // function onSearch(value){
    // // 링크이동 + 검색 내용 
    // window.location.href=`/video/search/${value}`
    // }


    // 유저의 비디오 검색
    useEffect(() => {

        Axios.post('/api/video/searchUserVideo' , variable)
        .then(response => {
            if ( response.data.success){
                console.log(response.data)
                setVideo(response.data.userVideos)
            }
            else{
                alert('광고 비디오 가져오기 실패')
            }
        })
    }, [])

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
            <span style={{  }}>조회수 {video.views}  </span> - <span>{moment(video.createdAt).format("MM Do YYYY")}</span>
        </Col>
    })

  
    if (userId) {
    
        return (

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <Title level={2} > 내 채널 정보 </Title>
                <hr />
                
                <Title level={2} > 내 동영상 </Title>
                <hr />
                <Row gutter={[32, 16]}>
                    {renderCards}
                </Row>

              
               
            </div>
        )

    } else {
        return (
            <div> ....로딩중입니다 </div>
        )
    }

}
export default MyVideoPage
