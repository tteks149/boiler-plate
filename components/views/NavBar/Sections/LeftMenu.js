import React from 'react';
import { Menu } from 'antd';
import { useSelector } from "react-redux";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  const user = useSelector(state => state.user)
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">메인화면</a>
    </Menu.Item>

  
    <Menu.Item key="medal">
      <a href="/medal">칭호 상점</a>
    </Menu.Item>

    <Menu.Item key="wallet">
    <a href={`/wallet/${user.userData && user.userData._id}`}>내 지갑</a>
    </Menu.Item>

  </Menu>
  )
}

export default LeftMenu