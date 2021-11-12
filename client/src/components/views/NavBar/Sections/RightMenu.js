/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('로그아웃 실패')
      }
    });
  };

  // 유저데이터 로딩 유무 확인. 
  if (user.userData && !null) {
    // 로그인 하지 않은 상태
    if (user.userData && !user.userData.isAuth) {
      return (
        <Menu mode={props.mode}>
          <Menu.Item key="mail">
            <a href="/login">로그인</a>
          </Menu.Item>
          <Menu.Item key="app">
            <a href="/register">회원가입</a>
          </Menu.Item>
        </Menu>
      )
      // 관리자 계정 로그인 상태
    } else if (user.userData && user.userData.isAdmin) {
      return (
        <Menu mode={props.mode}>
          <Menu.Item key="upload">
            <a href="/video/adverUpload">광고비디오업로드</a>
          </Menu.Item>

          <Menu.Item key="modify">
            <a href="/video/adverModify">광고비디오수정</a>
          </Menu.Item>

          <Menu.Item key="logout">
            <a onClick={logoutHandler}>로그아웃</a>
          </Menu.Item>
        </Menu>
      )
    }
    // 일반 계정 로그인 상태
    else {
      return (
        <Menu mode={props.mode}>

          <Menu.Item key="upload">
            <a href="/video/upload">비디오업로드</a>
          </Menu.Item>

          <Menu.Item key="modify">
            <a href={`/video/modify/myVideo/${user.userData._id}`}>내 채널</a>
          </Menu.Item>

          <Menu.Item key="logout">
            <a onClick={logoutHandler}>로그아웃</a>
          </Menu.Item>
        </Menu>
      )
    }
  }
  else {
    return (
      <Menu mode={props.mode}>
          <Menu.Item >
            ...로딩중
          </Menu.Item>
      </Menu>
    )
  }

}

export default withRouter(RightMenu);

