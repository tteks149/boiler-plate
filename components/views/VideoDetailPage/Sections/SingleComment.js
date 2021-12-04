import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from 'react-redux';

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    
    const onclickReplyOpen = () => {
        setCommentValue(props.comment.content)
        setOpenReply(!OpenReply)
    }
    const onModify = (event) => {
        event.preventDefault();
        const variables = {
            _id: props.comment.writer._id,
            content: CommentValue
        }
        Axios.post('/api/comment/modifyComment', variables)
            .then(response => {
                if (response.data.success) {
                   
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshAllFunction()
                    
                    
                }
                else {
                    alert('커멘트를 저장하지 못했습니다.')
                }
            })
    }
    const onDelete = (event) => {
        event.preventDefault();
        const variable = {
            _id: props.comment._id
        }
        Axios.post('/api/comment/deleteComment', variable)
            .then(response => {
                if (response.data.success) {
                   
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshAllFunction()
                    
                    
                }
                else {
                    alert('커멘트를 저장하지 못했습니다.')
                }
            })
    }
    const actions = [
        // 답글추가 일단 제거
        // <span onClick={onclickReplyOpen} key="comment-basic-reply-to">답글 추가</span>
    ]
    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} art="image" />}
                content={<p>{props.comment.content}</p>}
            />
            {props.userId===props.comment.writer._id &&
            <div>
                <Button style={{border:'0',outline:'0' }} size="small" onClick={onclickReplyOpen} >
                        수정
                </Button>
                <Button style={{border:'0',outline:'0' }} size="small" onClick={onDelete} >
                    삭제
                </Button>
            </div>
            } 
            {OpenReply &&
            
                <form style={{ display: 'flex' }} onSubmit={onModify}>
                    <input
                        type="text"
                        style={{ width: '100%', borderRadius: '5px' }}
                        value={CommentValue}
                        onChange={onHandleChange}
                        placeholder="코멘트를 작성해 주세요"
                    />
                    <br />
                    <Button type="primary" style={{ width: '20%', height: '52px' }} onClick={onModify}>수정</Button>
                    
                </form>
            }
        </div>
    )
}

export default SingleComment