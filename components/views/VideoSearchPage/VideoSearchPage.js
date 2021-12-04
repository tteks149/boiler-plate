import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Icon, Avatar, Typography, Input, } from 'antd';
import Axios from 'axios';
import moment from 'moment';
//http://localhost
//http://218.54.208.248
const { Title } = Typography;
const { Meta } = Card;
const { Search } = Input;
//const onSearch = value => console.log(value);


function VideoSearchPage(props) {

    const searchtitle = props.match.params.videoTitle
    const variable = {title:searchtitle }

    const [Video, setVideo] = useState([])

    function onSearch(value){
    // 링크이동 + 검색 내용
    window.location.href=`/video/search/${value}`
    }
    
    
    useEffect(() => {
        Axios.post('/api/video/searchVideo', variable)
        .then(response => {
            if (response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
               
            }else{
                alert('서버 검색 실패.')
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
            <span>{video.writer.name}</span> <br />
            <span style={{ marginLeft: '3rem' }}>조회수 {video.views}  </span> - <span>{moment(video.createdAt).format("MM Do YYYY")}</span>
        </Col>
    })
    //비디오 데이터 유무 확인
    if(Video && !null){  
        //비디오 검색 결과 있음
        if(Video.length != 0){
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
                    <Title level={2} > 검색 결과 </Title>
                    <hr />
                    <Row gutter={[32, 16]}>
                        {renderCards}
                    </Row>
        
                </div>
            )
           
        }
        //비디오 검색결과 없음
        else {
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
                    <Title level={2} > 검색 결과 </Title>
                    <hr />
                </div>
            )
           
        }
    }else{
        return(
            
            <div style={{ width: '85%', margin: '1rem auto' }}>

            ...로딩중
            </div>
        )
       
    }
  
}

export default VideoSearchPage
