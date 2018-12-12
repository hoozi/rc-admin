import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import checkPermissions from './checkPermissions';
import omit from 'lodash/omit';
import isNil from 'lodash/isNil';

const omitRouteRenderProperties = route => {
  return omit(route, ['render', 'component'])
}

export default class AuthorizedRoute extends Component {
  static propTypes = {
    authorities: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.func,
    ]),
    redirectData: PropTypes.arrayOf(PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string
    })),
    normalRoutes: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
      redirect: PropTypes.string,
      component: PropTypes.func,
    })),
    normalLayout: PropTypes.func,
    authorizedRoutes: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
      permissions: PropTypes.arrayOf(PropTypes.string),
      component: PropTypes.func,
      redirect: PropTypes.string,
      unauthorized: PropTypes.func,
    })),
    authorizedLayout: PropTypes.func,
    notFound: PropTypes.func,
    
  }
  static defaultProps = {
    authorities: '',
    redirectData: [],
    normalRoutes: [],
    normalLayout: <div></div>,
    authorizedRoutes: [],
    authorizedLayout: <div></div>,
    notFound: <div>404</div>
  }
  renderBaseRoute = (render, route) => (
    <Route
      key={route.path}
      {...omitRouteRenderProperties(route)}
      render={render}
    />
  ) 
  renderRedirectRoute = route => (
    this.renderBaseRoute(() => (<Redirect to={route.redirect}/>), route)
  )
  renderAuthorizedRoute = route => {
    const { authorizedLayout: AuthorizedLayout, permissions } = this.props;
    const {
      authorities='',
      redirect,
      component: RouteComponent,
      unauthorized: Unauthorized,
    } = route;
    const hasPermissions = checkPermissions(authorities, permissions);

    if(!hasPermissions && redirect) {
      return this.renderRedirectRoute(route)
    }

    return this.renderBaseRoute(props => {
        return (
          <AuthorizedLayout {...props}>
            {!hasPermissions && route.unauthorized ? <Unauthorized {...props}/> : <RouteComponent {...props}/>}
          </AuthorizedLayout>
        )
      }, route)
  }
  renderUnAuthorizedRoute = route => {
    const { normalLayout: NormalLayout } = this.props;
    const { redirect, component: RouteComponent } = route;
    if (isNil(RouteComponent) && !isNil(redirect)) {
      return this.renderRedirectRoute(route);
    }
    return this.renderBaseRoute(props => {
        return (
          <NormalLayout {...props}>
            <RouteComponent {...props} />
          </NormalLayout>
        )
      }, route);
  }
  renderNotFoundRoute = () => {
    const { notFound: NotFound, authorizedLayout: AuthorizedLayout } = this.props;
    return (
      <Route
        render={props => {
          return (
            <AuthorizedLayout {...props}>
              <NotFound {...props}/>
            </AuthorizedLayout>
          )
        }}
      />
    )
  }
  render() {
    const { normalRoutes, authorizedRoutes, redirectData } = this.props;
    return (
      <Switch>
        {redirectData.map(item => (
          <Redirect key={item.from} exact from={item.from} to={item.to} />
        ))}
        {normalRoutes.map(route => (
          this.renderUnAuthorizedRoute(route)
        ))}
        {authorizedRoutes.map(route => (
          this.renderAuthorizedRoute(route)
        ))}
        {this.renderNotFoundRoute()}
      </Switch>
    );
  }
}