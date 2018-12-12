import React, { Component } from 'react';
import {
  Layout,
  Icon,
  Breadcrumb
} from 'antd';
import Header from './Header';
import SiderMenu from './SiderMenu';
import { connect } from 'react-redux';
import styles from './BasicLayout.less';
import LoginChecker from '@/hoc/LoginChecker';
import getMenuData from '@/app/menu';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '@/utils';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const BreadcrumbItem = Breadcrumb.Item;

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

  getBreadcrumb = (breadcrumbNameMap, url) => {
    let breadcrumb = breadcrumbNameMap[url];
    if (!breadcrumb) {
      Object.keys(breadcrumbNameMap).forEach(item => {
        if (pathToRegexp(item).test(url)) {
          breadcrumb = breadcrumbNameMap[item];
        }
      });
    }
    return breadcrumb || {};
  };
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(getMenuData());
    return routerMap;
  }

  conversionFromLocation = () => {
    const { location: { pathname } } = this.props;
    const pathSnippets = urlToList(pathname);
    return this.renderBreadcrumbItem(pathSnippets);
  }

  handleSiderToggle = () => {
    this.props.onSiderCollapsed(this.collapsed);
    this.collapsed = !this.collapsed;
  }
  renderBreadcrumbItem = urls => {
    const breadcrumItem = urls.map((url, index) => {
      const current = this.getBreadcrumb(this.getBreadcrumbNameMap(), url);
      const isLinkable = index !== urls.length-1;
      const currentName = current.name;
      return currentName && !current.hideBreadcrumbItem ? (
        <BreadcrumbItem key={url}>
          {isLinkable ? <Link to={url}>{currentName}</Link> : <span>{currentName}</span>}
        </BreadcrumbItem>
      ) : null;
    });
    breadcrumItem.unshift(
      <BreadcrumbItem key='home'>
        <Link to='/'><Icon type='home' theme='filled'/></Link>
      </BreadcrumbItem>
    );
    return breadcrumItem;
  }
  renderBreadcrumb = () => {
    const breadcrumbList = this.conversionFromLocation();
    return (
      <Breadcrumb>
        {breadcrumbList}
      </Breadcrumb>
    )
  }
  render() {
    const { collapsed, appName, fixedHeader, fixedSider, location: { pathname } } = this.props;
    return (
      <LoginChecker isLogin={true}>
        <Layout style={{minHeight: '100vh'}}>
          <Header
            fixed={fixedHeader}
            onSiderToggle={this.handleSiderToggle}
            collapsed={collapsed}
            logoWrapWidth={initSiderWidth}
            appName={appName}
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
              <div className={styles.pageHeader}>{this.renderBreadcrumb()}</div>
              <div className={styles.pageContent}>{this.props.children}</div>
            </Content>
          </Layout>
        </Layout>
      </LoginChecker>
    );
  }
}

export default BasicLayout;