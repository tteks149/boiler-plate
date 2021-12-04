import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon, Switch } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
//http://localhost
//http://218.54.208.248
const { TextArea } = Input;
const { Title } = Typography;

//<Icon type="plus" style={{fontSize:'3rem'}} />



const CategoryOptions = [
    { value: 0, label: "음악" },
    { value: 1, label: "게임" },
    { value: 2, label: "영화" },
    { value: 3, label: "뉴스" },
    { value: 4, label: "스포츠" },
    { value: 5, label: "교육" },
    { value: 6, label: "음식" },
    { value: 7, label: "기타" }
]

function VideoModifyPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }
    const [VideoDetail, setVideoDetail] = useState([])

    const user = useSelector(state => state.user);

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("영화")

    useEffect(() => {

        // 수정 하기전, 기존 데이터를 보여주기 위함.
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                }
                else {
                    alert('비디오 디테일 정보 가져오기 실패')
                }
            })
    }, [])


    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    function onChange(checked) {
        if (checked) {
            setPrivate(1)
        } else {
            setPrivate(0)
        }
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const deleteVideo = (e) => {

        if (window.confirm("정말로 동영상을 삭제하시겠습니까???")) {
            // 삭제 확인 
            const variables = {
                videoId: VideoDetail._id,
                url: VideoDetail.filePath,
                thumbnail: VideoDetail.thumbnail
            }

            // 먼저 서버 upload 경로 동영상 파일을 삭제
            Axios.post('/api/video/deleteVideoFile', variables)
                .then(response => {
                    if (response.data.success) {

                        // 서버 해당 동영상의 썸네일 파일을 삭제
                        Axios.post('/api/video/deleteVideoThumbnailFile', variables)
                            .then(response => {
                                if (response.data.success) {

                                    //DB의 동영상 댓글 삭제
                                    Axios.post('/api/comment/deleteVideoComment', variables)
                                        .then(response => {
                                            if (response.data.success) {

                                                //DB의 동영상 데이터 삭제
                                                Axios.post('/api/video/deleteVideo', variables)
                                                    .then(response => {
                                                        if (response.data.success) {

                                                            // 성공 메시지 출력
                                                            message.success('성공적으로 동영상을 삭제 했습니다.')

                                                            // 마이비디오 페이지로 돌아감
                                                            setTimeout(() => {
                                                                props.history.push(`/video/modify/myVideo/${user.userData._id}`)
                                                            }, 1000);

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
        else {
            // 삭제 취소.. 아무것도 안함 
        }
    }


    const deleteComment = (e) => {

        if (window.confirm("정말로 댓글을 삭제하시겠습니까???")) {
            // 삭제 확인 
            const variables = {
                videoId: VideoDetail._id,
                url: VideoDetail.filePath,
                thumbnail: VideoDetail.thumbnail
            }
            console.log("test1")
            Axios.post('/api/comment/deleteVideoComment', variables)
                .then(response => {
                    if (response.data.success) {
                        message.success('성공적으로 동영상 댓글을 삭제 했습니다.')

                    }
                    else {
                        alert('댓글 삭제 실패..')
                    }
                })

        }
        else {
            // 삭제 취소.. 아무것도 안함 
        }
    }

    const modifyVideo = (e) => {
        e.preventDefault();

        const variables = {
            videoId: VideoDetail._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            category: Category
        }

        if ( VideoTitle == "" || Description=="" )
        {
            alert(`모든 항목을 기입하세요!`)
        }
        else{
            Axios.post('/api/video/modifyVideo', variables)
            .then(response => {
                if (response.data.success) {
                    message.success('성공적으로 동영상을 수정 했습니다.')
                    setTimeout(() => {
                        props.history.push(`/video/modify/myVideo/${user.userData._id}`)
                    }, 1000);
                } else {
                    alert(`동영상 수정에 실패했습니다.`)
                }
            })
        }

       
    }


    if (VideoDetail) {
        return (

            <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Title level={2}>비디오 수정 </Title>
                </div>

                <Form
                    name = "basic"
                    onSubmit={modifyVideo}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>


                        <div>
                            <img src={`http://218.54.208.248:5000/${VideoDetail.thumbnail}`} alt="thumbnail" />
                        </div>



                    </div>

                    <br />
                    <br />

                    <label>제목</label>

                    <Form.Item
                        label="제목"
                        name="title"
                        rules={
                            [
                                {
                                    required: true,
                                    message: 'Please input your username!'
                                },
                            ]}
                    >
                        <Input
                            placeholder={VideoDetail.title}
                            onChange={onTitleChange}
                            value={VideoTitle}
                            allowClear
                        />
                    </Form.Item>

                    <br />
                    <br />

                    <label>설명</label>
                    <TextArea
                        placeholder={VideoDetail.description}
                        onChange={onDescriptionChange}
                        value={Description}
                        allowClear
                    />

                    <br />
                    <br />


                    <label>공개여부</label>
                    <br />
                    <Switch checkedChildren="공개" unCheckedChildren="비공개" onChange={onChange} />
                    <br />


                    <br />
                    <br />
                    <label>카테고리</label>
                    <br />
                    <select onChange={onCategoryChange}>
                        {CategoryOptions.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>

                    <br />
                    <br />


                    <Button type="primary" size="large" onClick={modifyVideo} >
                        비디오 수정
                    </Button>

                    <Button type="danger" size="large" onClick={deleteVideo} style={{ marginLeft: '10rem' }}>
                        비디오 삭제
                    </Button>

                    <Button type="danger" size="large" onClick={deleteComment} style={{ marginLeft: '10rem' }}>
                        댓글 삭제
                    </Button>

                </Form>
            </div>
        )

    } else {
        return (
            <div>...로딩중</div>
        )
    }

}

export default VideoModifyPage
