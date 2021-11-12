import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment'

function ReplyComment(props) {

    
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(0)

    useEffect(() => {
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if (comment.responseTo ===  props.parentCommentId)
                commentNumber++
        })
        setChildCommentNumber(commentNumber)
    }, [props.commentLists , props.parentCommentId])

    let renderReplyComment = (parentCommentId) =>

        props.commentLists.map((comment, index) => (

            <React.Fragment>
                {
                    comment.responseTo ===  parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId} />
                        <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} parentCommentId={comment._id} postId={props.postId} />
                    </div>
                }
            </React.Fragment>
        ))
    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }
    return (
        // <div> 답글추가 0 발생때문에 제거
        //     {ChildCommentNumber > 0 &&
        //         <p style={{ fontsize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
        //             view {ChildCommentNumber} more comments(s)
        //         </p>
        //     }

        //     {OpenReplyComments &&  
        //         renderReplyComment(props.parentCommentId) 
        //     }

        // </div>
        <hr style={{ color: 'gray' }}/>
    )
}

export default ReplyComment