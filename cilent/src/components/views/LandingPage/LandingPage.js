import React , {useEffect , useState} from 'react'
import { Row, Col,Card, Icon, Avatar, Typography } from 'antd';
import { FaCode } from "react-icons/fa";
import Axios from 'axios';
import moment from 'moment';

const {Title} = Typography;
const {Meta} = Card;

function LandingPage() {
    
    const [Video, setVideo] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)

            }else{
                alert('서버에서 비디오 가져오기를 실패 했습니다.')
            }
        })
    
    }, [])

    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return  <Col lg={6} md={8} xs={24}>
        <a href={`/video/post/${video._id}`}> 
            <div style={{position: 'relative'}}>
                <img style={{width: '100%'}} src={`http://218.54.208.248:5000/${video.thumbnail}`}></img>
                <div className="duration">
                  <span>{minutes} : {seconds} </span> 
                </div>
            </div>
        </a>
        <br />
        <Meta
            avatar={
                <Avatar src={video.writer.image} />
            }
            title={video.title}
            description=""
            />
            <span>{video.writer.name}</span> <br />
            <span style={{ marginLeft: '3rem'}}>조회수 {video.views}  </span> - <span>{moment(video.createdAt).format("MM Do YYYY")}</span>
        </Col>
    })

    return (
       <div style={{ width: '85%', margin: '3rem auto'}}>
           <Title level ={2} > 추천 영상 </Title>
           <hr />
           <Row gutter={[32,16]}> 
               {renderCards}

           </Row>

       </div>
    )
}

export default LandingPage
