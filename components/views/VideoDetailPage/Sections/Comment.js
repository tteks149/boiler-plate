import Axios from "axios";
import React, { useState } from "react";
import { useSelector } from 'react-redux';
import SingleComment from '../Sections/SingleComment'
import ReplyComment from '../Sections/ReplyComment'
import refreshFunction from '../VideoDetailPage'
import { Button, Input } from 'antd';

const { TextArea } = Input;

function Comment(props) {

    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState("")

    const hanleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {

        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.postId
        }

        Axios.post('../api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)
                    setcommentValue("")
                    props.refreshFunction(response.data.result)
                }
                else { alert('커멘트를 저장하지 못했습니다.') }
            })
    }

    return (
        <div>
            <br />
            <p>댓글</p>
            <hr />


            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} refreshAllFunction={props.refreshAllFunction } comment={comment} postId={props.postId} userId={user.userData&&user.userData._id}/>
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={props.postId} commentLists={props.commentLists} />
                    </React.Fragment>
                )
            ))}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <input
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={hanleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <Button type="primary" style={{ width: '20%', height: '52px' }} onClick={onSubmit}>댓글 추가</Button>
            </ form>

        </div>
    )
}

export default Comment