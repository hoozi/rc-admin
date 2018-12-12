import React, { Component } from 'react';
import {
  Layout,
  Icon,
  Avatar,
  Menu,
  Tooltip,
  Dropdown
} from 'antd';
import logo from '@/assets/logo.svg';
import styles from './Header.less';
import classNames from 'classnames';

const { Header } = Layout;

const fullScreen = exit => {
  const de = document.documentElement;
  const fullScreens = ['webkitRequestFullScreen', 'mozRequestFullScreen', 'msRequestFullScreen', 'requestFullscreen'];
  const exitFullScreens = ['exitFullscreen', 'mozCancelFullScreen', 'webkitCancelFullScreen', 'msExitFullscreen'];
  fullScreens.forEach(item => {
    if((item in de) && !exit) {
      return de[item].call(de);
    }
  });
  exitFullScreens.forEach(item => {
    if((item in document) && exit) {
      return document[item].call(document);
    }
  });
}

export default class HeaderView extends Component {
  fullScreen = false;
  state = {
    fullScreen: false
  }
  handleFullScreen = () => {
    this.setState(prevState => {
      !prevState.fullScreen ? fullScreen() : fullScreen(true);
      return {
        fullScreen: !prevState.fullScreen
      }
    })
  }
  renderRightContent = () => {
    const { fullScreen } = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.headerRight}>
        <div className={styles.right}>
          <Tooltip title={fullScreen ? '退出全屏' : '全屏'}>
            <span className={styles.action} onClick={this.handleFullScreen}>
              <Icon type={fullScreen ? 'fullscreen-exit' : 'fullscreen'}/>
            </span>
          </Tooltip>
          {/* <Tooltip>
            <a
              target="_blank"
              href="https://pro.ant.design/docs/getting-started"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip> */}
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar 
                size='small'
                src='http://img.zcool.cn/community/01313a5656cd1332f87512f68f3950.jpg@1280w_1l_2o_100sh.png'
                className={styles.avatar}
              />
              <span className={styles.name}>admin</span>
            </span>
          </Dropdown>
        </div>
      </div>
    )
  }
  render() {
    const { fixed, onSiderToggle, collapsed, logoWrapWidth, appName } = this.props;
    const headerClassNames = classNames(styles.headerWrap, {
      [styles.headerFixed]: fixed
    });
    const logoWrapClassNames = classNames(styles.logoWrap, {
      [styles.logoWrapCollapsed]: collapsed
    });
    return (
      <Header className={headerClassNames}>
        <div className={logoWrapClassNames} style={{width: collapsed ? 64 : logoWrapWidth}}>
          <img src={logo} alt={appName}/>
          <a href='/' className={styles.webName}><h1>{appName}</h1></a>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} className={styles.toggleButton} onClick={onSiderToggle}/>
        </div>
        {this.renderRightContent()}
      </Header>
    );
  }
}