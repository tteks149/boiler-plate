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
        setOpenReply(!OpenReply)
    }
   
    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                   
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
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
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주십시오"
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onclick={onSubmit}>Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment