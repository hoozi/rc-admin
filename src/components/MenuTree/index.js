import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Menu
} from 'antd';
import { Link } from 'react-router-dom';
import memoizeOne from 'memoize-one';
import { getMenuMatchKeys, getFlatMenuKeys, urlToList } from '@/utils';
import { Authorized } from '@/components/Authorized';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export default class MenuTree extends Component {
  static propTypes = {
    menuData: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
      icon: PropTypes.string,
      children: PropTypes.array,
    }))
  }
  constructor(props) {
    super(props);
    this.selectedKeys = memoizeOne((pathname, fullPathMenu) => (
      getMenuMatchKeys(getFlatMenuKeys(fullPathMenu), urlToList(pathname))
    ));

    const { pathname, menuData } = props

    this.state = {
      openKeys: this.selectedKeys(pathname, menuData)
    }
  }
  
  checkPermissionsItem = (item,Item) => (
    <Authorized
      key={item.path}
      authorities={item.authority}
      target={Item}
    />
  )

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  // 如果有children的话，那么菜单只打开一个submenu
  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };
  getMenuItemPath = item => (
    <Link to={item.path} href={item.path} target={item.target}>
      <span>
        {item.icon && <Icon type={item.icon}/>}
        <span>{item.name}</span>
      </span>
    </Link>
  )
  renderMenuItem = item => {
    if(item.children && item.children.some(child => child.name)) {
      const childrenItems = this.renderMenuItems(item.children);

      // 当无子菜单时就不展示分级菜单
      if(childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                {item.icon && <Icon type={item.icon}/>}
                <span>{item.name}</span>
              </span>
            }
          >
            {childrenItems}
          </SubMenu>
        )
      }
      return null;
    } 
    return <MenuItem key={item.path}>{this.getMenuItemPath(item)}</MenuItem>;
  }
  renderMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const ItemDom = this.renderMenuItem(item);
        return  item.authority ? this.checkPermissionsItem(item, ItemDom) : ItemDom;
      })
      .filter(item => item);
  }
  render() {
    const { pathname, menuData } = this.props;
    const { openKeys } = this.state;
    let selectedKeys = this.selectedKeys(pathname, menuData);
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Menu
        style={{border: 0}}
        mode="inline"
        onOpenChange={this.handleOpenChange}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
      >
        {
          this.renderMenuItems(menuData)
        }
      </Menu>
    )
  }
}