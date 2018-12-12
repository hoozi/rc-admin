import React from 'react';
import { connect } from 'react-redux';
import { AuthorizedRoute } from '@/components/Authorized';
import { ConnectedRouter } from 'connected-react-router';
import BasicLayout from '@/layouts/BasicLayout';
import NormalLayout from '@/layouts/NormalLayout';
import Exception404 from '@/pages/Exception/404';
import { authorizedRoutes, normalRoutes } from './routerConfig';
import getMenuData from '../menu';

const redirectData = [];

// 默认重定向到最底层第一个子路径
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const Router = ({history}) => (
  <ConnectedRouter history={history}>
    <AuthorizedRoute
      permissions={window.localStorage.getItem('permissions') || []}
      redirectData={redirectData}
      authorizedRoutes={authorizedRoutes}
      authorizedLayout={BasicLayout}
      normalRoutes={normalRoutes}
      normalLayout={NormalLayout}
      notFound={Exception404}
    />
  </ConnectedRouter>
)

export default connect()(Router);

