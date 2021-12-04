import React, { useState, useEffect } from 'react'
import { Row, Col, List, Button,message } from 'antd'
import Axios from 'axios'
import {useSelector} from 'react-redux'

function MedalDetailPage(props) {
    const user= useSelector(state => state.user)
    const medalId = props.match.params.medalId
    const variable = { medalId: medalId }

    const [MedalDetail, setMedalDetail] = useState([])

    useEffect(() => {
        Axios.post('/api/medals/getMedalDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setMedalDetail(response.data.medalDetail)
                } else {
                    alert('칭호 정보 가져오기 실패')
                }
            })
    }, [])
    

    const onSubmit = (e) => {
            e.preventDefault();
            const variables={
                userId: user.userData._id,
                medalTitle: MedalDetail.medalTitle,
                medalId: MedalDetail._id
            }

            Axios.post('/api/users/getMedalList',variables)
                .then(response=> {
                    if(response.data.success){
                        const arr=response.data.user.medalList
                        if(arr.find(element => element.medalId === medalId)){
                            message.error('이미 가지고 있는 칭호입니다.')
                            setTimeout(() => {
                                props.history.push('/medal')
                            },1000);
                        }else{
                        Axios.post('/api/medals/updateUsersMedal',variables)
                        .then(response=> {
                            if(response.data.success) {
                                message.success('칭호 구매 성공!')
        
                                setTimeout(() => {
                                    props.history.push('/')
                                },1000);
                            }else{
                                alert(' 칭호 구매 실패')
                            }
                        })
                    }
                }})
    }
    const onDelete = (e) => {

        e.preventDefault();
       
        if (window.confirm("정말로 칭호를 삭제하시겠습니까???")) 
        {
            const val= {
                medalId:MedalDetail._id
            }
            Axios.post('/api/medals/deleteMedal',val)
                .then(response=>{
                    if(response.data.success){
                        message.success('칭호 삭제 성공!')
                        setTimeout(() => {
                            props.history.push('/medal')
                        },1000);
                    }
                })
        }
        else{
            // 아무것도 안함
        }
      
    }
    if (user.userData && user.userData.isAdmin)
    {
        return (

            <Row gutter={[16, 16]}>
                <br />
                <br />
                <br />
                <br />
                <br />
                <Col >
                    <div style={{ width: '100%', padding: '3rem 4rem', textAlign: 'center' }}>
                        <b style={{ fontSize: '8rem' }}> {MedalDetail.medalTitle}</b>
    
                        <List.Item 
                            actions
                        >
                            <List.Item.Meta
                                title={MedalDetail.name}
                                description={MedalDetail.description}
                            />
    
                        </List.Item>
                        <br />
    
                        <span>가격: {MedalDetail.price} kit</span>
                        <br />
                        <br />
                        
                        <Button type="primary" size="large"  href={`/medal/update/${MedalDetail._id}`} style={{ background: "orange", borderColor: "orange" }}>
                            수정하기
                        </Button>
                        <Button type="primary" size="large"  onClick={onDelete} style={{ background: "red", borderColor: "red" ,marginLeft: '10rem'}}>
                            삭제하기
                        </Button>
                    </div>
                </Col>
    
            </Row>
        )
    }
    else{
        return (

            <Row gutter={[16, 16]}>
                <br />
                <br />
                <br />
                <br />
                <br />
                <Col >
                    <div style={{ width: '100%', padding: '3rem 4rem', textAlign: 'center' }}>
                        <b style={{ fontSize: '8rem' }}> {MedalDetail.medalTitle}</b>
    
                        <List.Item 
                            actions
                        >
                            <List.Item.Meta
                                title={MedalDetail.name}
                                description={MedalDetail.description}
                            />
    
                        </List.Item>
                        <br />
    
                        <span>가격: {MedalDetail.price} kit</span>
                        <br />
                        <Button type="primary" size="large" onClick={onSubmit} disabled={false}>
                            구매하기
                        </Button>
                        <br /><br />
                    </div>
                </Col>
    
            </Row>
        )
    }
    
}

export default MedalDetailPage