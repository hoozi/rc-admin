import React, { Component } from 'react';
import {
  Layout
} from 'antd';
import Header from './Header';
import SiderMenu from './SiderMenu';
import { connect } from 'react-redux';
import styles from './BasicLayout.less';
import LoginChecker from '@/hoc/LoginChecker';

const { Content } = Layout;

const initSiderWidth = 256;

const mapStateToProps = ({ app }) => {
  return {
    collapsed: app.get('collapsed'),
    appName: app.get('appName'),
    fixedHeader: app.get('fixedHeader'),
    fixedSider: app.get('fixedSider')
  }
}

const mapDispatchToProps = ({ app: { toggleCollapsed } }) => {
  return {
    onSiderCollapsed: collapsed => toggleCollapsed(collapsed)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class BasicLayout extends Component {
  getLayoutStyles = (collapsed, fixed) => {
    return {
      paddingTop: this.props.fixedHeader ? 64 : 0,
      paddingLeft: collapsed ? 64 : 256 
    }
  }

  collapsed = true;

  

  handleSiderToggle = () => {
    this.props.onSiderCollapsed(this.collapsed);
    this.collapsed = !this.collapsed;
  }
  
  render() {
    const { collapsed, appName, logo, fixedHeader, fixedSider, location: { pathname } } = this.props;
    return (
      <LoginChecker isLogin={true}>
        <Layout style={{minHeight: '100vh'}}>
          <Header
            fixed={fixedHeader}
            onSiderToggle={this.handleSiderToggle}
            collapsed={collapsed}
            logoWrapWidth={initSiderWidth}
            appName={appName}
            logo={logo}
          />
          <Layout
            style={this.getLayoutStyles(collapsed, true)}
          >
            <SiderMenu
              fixed={fixedSider}
              width={initSiderWidth}
              theme='light'
              collapsible
              collapsed={collapsed}
              trigger={null}
              pathname={pathname}
            />
            <Content className={styles.layoutContent}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </LoginChecker>
    );
  }
}

export default BasicLayout;