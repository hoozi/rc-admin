import React, { Component } from 'react';
import {
  Breadcrumb,
  Icon
} from 'antd';
import getMenuData from '@/app/menu';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '@/utils';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const BreadcrumbItem = Breadcrumb.Item;

class BreadcrumbView extends Component {
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
    return this.renderBreadcrumb();
  }
}

export default withRouter(BreadcrumbView);