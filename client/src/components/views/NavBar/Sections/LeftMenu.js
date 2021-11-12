import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">메인화면</a>
    </Menu.Item>

    <Menu.Item key="shop">
      <a href="/shop">상품구매</a>
    </Menu.Item>
    
  </Menu>
  )
}

export default LeftMenu