import React, { useState , useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon, Switch } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;


// 파일 올리면, 썸네일 생기는데, 이때 서버에 파일이 저장됨.
// 만약 뒤로가기하면 그대로 파일이 서버에 남아서 삭제하는 과정이 필요..


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


function VideoUploadPage(props) {


    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("영화")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")


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

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {

                    // 썸네일 생성 위한 변수 지정
                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }


                    setFilePath(response.data.url)


                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {

                                
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)


                            } else {
                                alert('썸네일 생성 실패.')
                            }
                        })

                } else {
                    alert('동영상 업로드를 실패했습니다.')
                }
            })

    }
    const deleteVideo = (e) => {

        if (window.confirm("비디오 업로드를 취소하시겠습니까?")) {

            // 서버에 썸네일, 비디오 파일이 남아있으면 삭제
            if (ThumbnailPath)
            {
                 
            const variables = {
                url: FilePath,
                thumbnail: ThumbnailPath
            }

            // 먼저 서버 upload 경로 동영상 파일을 삭제
            Axios.post('/api/video/deleteVideoFile', variables)
                .then(response => {
                    if (response.data.success) {

                        // 서버 해당 동영상의 썸네일 파일을 삭제
                        Axios.post('/api/video/deleteVideoThumbnailFile', variables)
                            .then(response => {
                                if (response.data.success) {

                                    // 성공 메시지 출력
                                    message.success('비디오 업로드를 취소했습니다.')

                                    // 메인 페이지로 돌아감
                                    setTimeout(() => {
                                        props.history.push(`/`)
                                    }, 1000);

                                } else {
                                    alert(`서버 동영상 썸네일 삭제에 실패했습니다.`)
                                }
                            })

                    } else {
                        alert(`서버 동영상 파일 제거에 실패했습니다.`)
                    }
                })
            }
            else{

                 // 성공 메시지 출력
                 message.success('비디오 업로드를 취소했습니다.')

                 // 마이비디오 페이지로 돌아감
                 setTimeout(() => {
                     props.history.push(`/`)
                 }, 1000);
            }
          
        }
        else {
            // 삭제 취소.. 아무것도 안함 
        }
    }
    
    const onsumit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        if ( VideoTitle == "" || Description==""  )
        {
            alert(`모든 항목을 기입하세요!`)
        }
        else if ( ThumbnailPath=="" )
        {
            alert(`동영상 파일을 올려주세요!`)
        }
        else{
            Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    message.success('성공적으로 동영상을 업로드 했습니다.')
                    setTimeout(() => {
                        props.history.push('/')
                    }, 1000);
                } else {
                    alert(`동영상 업로드에 실패했습니다.`)
                }
            })
        }
    }


    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>비디오 업로드 </Title>
            </div>

            <Form onSubmit={onsumit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <Dropzone
                        onDrop={onDrop}
                        // 파일 한번에 여러개할건지 하나만 할건지 
                        m ultiple={false}
                        // 파일 사이즈  1GB 제한 ( 바이트단위. 1024 * 1024 * 1024)
                        maxSize={1073741824}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }} {...getRootProps()}>
                                이곳을 클릭 또는 파일을 드롭하세요
                                <input{...getInputProps()} />
                            </div>
                        )}

                    </Dropzone>


                    {ThumbnailPath &&
                        <div>
                            <img src={`http://218.54.208.248:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }


                </div>

                <br />
                <br />

                <label>제목</label>

                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />

                <br />
                <br />

                <label>설명</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
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


                <Button type="primary" size="large" onClick={onsumit}>
                    등록
                </Button>

                <Button type="danger" size="large" onClick={deleteVideo} style={{ marginLeft: '10rem' }}>
                     등록 취소
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
