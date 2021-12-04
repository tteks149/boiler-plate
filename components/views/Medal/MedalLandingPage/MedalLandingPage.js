import React,{useEffect,useState} from 'react'
import {Card, Col,Typography,Row} from 'antd'
import axios from 'axios';
const {Title } = Typography
const { Meta } = Card;

function MedalLandingPage() {
    const [Medal,setMedal] =useState([])
    useEffect(()=> {
        axios.get('/api/medals/getMedals')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setMedal(response.data.medals)
            }else{
                alert('칭호 가져오기 실패')    
            }
        })



    },[])
    const renderCards =  Medal.map((medal,index)=> {
        return <Col lg={6} md={8} xs={24} key={index}>
        <a href={`/medal/${medal._id}`}>
            <div style={{ position: 'relative',textAlign:'center' }}>
             <b style={{fontSize:'5rem'}}> {medal.medalTitle}</b>
            </div>
        </a>
        <br />
        <Meta title={medal.name} />
        <span >{medal.count} 번 판매됨 </span>
    </Col> 
    })
    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}> 칭호를 구매해 이름을 꾸며보세요!</Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default MedalLandingPage