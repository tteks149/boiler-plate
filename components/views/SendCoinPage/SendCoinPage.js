import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { Formik, isInteger, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';

import {
  Form,
  Input,
  Button
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function SendCoinPage(props) {

  const userId = props.match.params.userId;
  const variable = { userId: userId }
  const [userWalletAdd, setUserWalletAdd] = useState([])
  const [userWalletAmount, setuserWalletAmount] = useState([])
  const user = useSelector(state => state.user);

  function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }

  function DoSign(signature , publicKey,  msgHash) {

    let ws = new WebSocket("ws://114.202.114.196:3000/wsForChat?openPort=3000");

    ws.onopen = (event) => {
      console.log("웹소켓 연결 성공")


      //var sendFromAddress = userWalletAdd[0].walletAddress;
      
      var sendDataInitial = 6;

      console.log("보내기 시작")
      ws.send(sendDataInitial);
      console.log(sendDataInitial);


      var testsig = toHexString(signature);
      console.log(testsig );

      ws.send(signature);
      console.log(signature)

      ws.send(publicKey);
      console.log(publicKey);

      ws.send(msgHash); 
      console.log(msgHash);
      console.log("끝")

    }

    ws.onmessage = (event) => {

      console.log(event);
      console.log(event.data);
      ws.close();
      // if ( event.data == "end")
      // {
      //   ws.close();
      // }
      // else{
      //   
      //   ws.send("test");
      // }

    }
    
  }

  useEffect(() => {
    Axios.post('/api/users/searchUserWalletAdd', variable)
      .then(response => {

        if (response.data.success) {
          setUserWalletAdd(response.data.userAdd)
          console.log(response.data.userAdd)

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
          }
        }
        else {
          alert('유저 정보 가져오기 실패')
        }
      })




  }, [])

  if (userWalletAmount) {

    return (
      <Formik
        initialValues={{
          toAddress: ''
          //money: 0,
        }}
        validationSchema={Yup.object().shape({
          toAddress: Yup.string()
            .required('상대방 지갑주소를 입력하지 않았습니다'),
          money: Yup.number()
            .max(userWalletAmount, '잔고가 모자랍니다.')
            .required('금액을 입력하지 않았습니다.')
        })}

        onSubmit={(values, { setSubmitting }) => {

          let ws = new WebSocket("ws://114.202.114.196:3000/wsForChat?openPort=3000");

          ws.onopen = (event) => {
            console.log("웹소켓 연결 성공")

            var sendDataInitial = 4;
            var sendFromAddress = userWalletAdd[0].walletAddress;
            var sendToAddress = values.toAddress;
            var sendAmount = values.money;

            var sendData = sendFromAddress + "/" + sendToAddress + "/" + sendAmount;
            console.log(sendData)

            ws.send(sendDataInitial);
            ws.send(sendData);

          }

          ws.onmessage = (event) => {

            // publicKey 보내서 코인서버에서 변환했는데 X,Y 널값나옴.
            // 서명하면  String 길이가 너무 짧음

            // -> 코인키에서 puiblicPoint에 x, y 한번 보내보기
            // 서명하는 함수 따른거 require해서 테스트 해보기
            console.log(event);
            console.log(event.data);

            var crypto = require("crypto");

            var eccrypto = require("eccrypto");
           
            var str = user.userData.privateKey;
            var strToKey = str.split('/');

            var buf = new ArrayBuffer(strToKey.length);
            var bufView = new Uint8Array(buf);

            for (var i = 0, strLen = strToKey.length; i < strLen; i++) {
              bufView[i] = parseInt(strToKey[i])
            }

            var CoinKey = require('coinkey')
            var ck = new CoinKey(bufView, true) 

            console.log(ck)
            var str = event.data;

            var msg = crypto.createHash("sha256").update(str).digest();

            //var signature = ecdsa.sign(msg, ck.privateKey)
            var signature = eccrypto.sign(ck.privateKey, msg);


            const secp256k1 = require('secp256k1')
            var sigObj = secp256k1.ecdsaSign(msg, ck.privateKey)

            console.log(signature);
            console.log(ck.publicKey)
            // console.log(sigObj)
            ws.close();

            DoSign(signature , ck.publicKey, event.data);
          }

        }}

      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          } = props;
          return (
            <div className="app">
              <h2>전송</h2>
              <Form style={{ minWidth: '375px', maxWidth: '500px' }} {...formItemLayout} onSubmit={handleSubmit} >

                <Form.Item required label="지갑 주소">
                  <Input
                    id="toAddress"
                    placeholder="상대방의 지갑주소를 입력하시오"
                    type="text"
                    value={values.toAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.toAddress && touched.toAddress ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.toAddress && touched.toAddress && (
                    <div className="input-feedback">{errors.toAddress}</div>
                  )}
                </Form.Item>
                <Form.Item required label="금액">
                  <Input
                    id="money"
                    placeholder={`현재 잔고: ${userWalletAmount}`}
                    type="text"
                    value={values.money}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.money && touched.money ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.money && touched.money && (
                    <div className="input-feedback">{errors.money}</div>
                  )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                    등록
                  </Button>
                </Form.Item>
              </Form>
            </div>
          );
        }}
      </Formik>
    );
  }
  else {

    return (
      <div> 로딩중...</div>
    );
  }

}

export default SendCoinPage