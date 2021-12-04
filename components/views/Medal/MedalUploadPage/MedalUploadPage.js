import React,{useState} from 'react'
import { Typography, Button, Form, message, Input } from 'antd'
import Axios from 'axios';
import {useSelector} from 'react-redux'

const { TextArea } = Input;
const { Title } = Typography;

function MedalUploadPage(props) {
    const user= useSelector(state => state.user)
    const [MedalTitle,setMedalTitle] =useState("")
    const [Name,setName]=useState("")
    const [Description,setDescription]=useState("")
    const [Price,setPrice]=useState("")

    const onTitleChange= (e) =>{
        setMedalTitle(e.currentTarget.value)
    }
    const onNameChange= (e) =>{
        setName(e.currentTarget.value)
    }
    const onDescriptionChange= (e) =>{
        setDescription(e.currentTarget.value)
    }
    const onPriceChange= (e) =>{
        setPrice(e.currentTarget.value)
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const variables={
            userId: user.userData._id,
            medalTitle: MedalTitle,
            name: Name,
            description: Description,
            price: Price,
        }
        if(variables.medalTitle==="" 
            || variables.name==="" 
            || variables.description==="" 
            || variables.price==="")
            {
                alert('모든 항목을 기입해야 합니다.')

            }
        else{
        Axios.post('/api/medals/uploadMedal',variables)
            .then(response=> {
                if(response.data.success) {
                    message.success('칭호 업로드 성공!')

                    setTimeout(() => {
                        props.history.push('/medal')
                    },1000);
                    
                }else{
                    alert(' 칭호 업로드 실패')
                }
            })
        }
    }
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>칭호 업로드</Title>
            </div>
        
            <Form >
                <label>칭호</label>
                <Input
                    required
                    onChange={onTitleChange}
                    value={MedalTitle}
                />
                <br />
                <br />
                <label>칭호이름</label>
                <Input
                    required
                    onChange={onNameChange}
                    value={Name}
                />
                <br />
                <br />
                <label>가격</label>
                <Input
                    required
                    onChange={onPriceChange}
                    value={Price}
                />
                <br />
                <br />
                <label>칭호설명</label>
                <TextArea
                    required={true}
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    업로드
                </Button>
            </Form>



        </div>
    )
}


export default MedalUploadPage