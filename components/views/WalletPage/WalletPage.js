import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Icon, Avatar, Typography, Input, } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
//http://localhost
//http://218.54.208.248
const { Title } = Typography;
const { Meta } = Card;
const { Search } = Input;
//const onSearch = value => console.log(value);


function WalletPage(props) {
    const userId = props.match.params.userId;
    const variable = { userId: userId }
    const [userWalletAdd, setUserWalletAdd] = useState([])
    // const [UserImage,setUserImage]=useState("")
    const [userWalletAmount, setuserWalletAmount] = useState([])

    useEffect(() => {
        Axios.post('/api/users/searchUserWalletAdd', variable)
            .then(response => {

                if (response.data.success) {
                    setUserWalletAdd(response.data.userAdd)
                    console.log(response.data.userAdd)
                    //console.log(response.data.userAdd[0].walletAddress)

                    var userWalletAddress = response.data.userAdd[0].walletAddress;

                    let ws = new WebSocket("ws://114.202.114.196:3000/wsForChat?openPort=3000");


                    ws.onopen = (event) => {
                        console.log("웹소켓 연결 성공")

                        var sendDataInitial = 5;
                        var sendData = userWalletAddress;

                        console.log(sendDataInitial);
                        console.log(sendData);


                        ws.send(sendDataInitial);
                        ws.send(sendData);
                    }

                    ws.onmessage = (event) => {

                        console.log(event);
                        console.log(event.data);
                        setuserWalletAmount(event.data);
                        ws.close();
                        console.log(userWalletAmount)
                    }
                }
                else {
                    alert('유저 정보 가져오기 실패')
                }
            })

    
    }, [])


    const renderUserAdd = userWalletAdd.map((user, index) => {

        return <div style={{ textAlign: 'center', marginBottom: '2rem', top: '40%' }}>

            <Title level={2} > 내 지갑 정보 </Title>
            <br />
            <div>
                주소: {user.walletAddress}
            </div>
            <br />
            <div>
                잔액: {userWalletAmount}
            </div>
            <br />
            <div>
                <a href={`/wallet/sendCoin/${userId}`}>전송</a>
            </div>
        </div>
    })

    if (userWalletAmount)
    {
        return (

            <div >
                {renderUserAdd}
    
            </div>
        )
    }
    else{
            return( 
            <div >
                로딩중...
            </div>
            )
    }
   
    // return (

    //     <div style={{ width: '85%', margin: '1rem auto' }}>

    //         <Title level={2} > 내 지갑 정보 </Title>
    //         <a href={'/wallet/sendCoin'}>
    //             전송
    //         </a>

    //     </div>
    // )



}
export default WalletPage