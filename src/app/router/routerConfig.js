import React from 'react';
import Loadable from 'react-loadable';
import PageLoading from '@/components/PageLoading';
import Exception403 from '@/pages/Exception/403';
import Exception500 from '@/pages/Exception/500';

const LoadingComponent = (path) => {
  return Loadable({
    loader: () => import(`@/pages/${path}`),
    loading: () => <PageLoading/>
  });
}

// pages
const Login = LoadingComponent('User/Login');
const Test = LoadingComponent('Test');
const Test2 = LoadingComponent('Test2');

const authorizedRoutes = [
  {
    path: '/test',
    exact: true,
    authorities: '1',
    unauthorized: Exception403,
    component: Test
  },
  {
    path: '/parent/sub',
    exact: true,
    component: Test2
  },
  {
    path: '/403',
    component: Exception403
  },
  {
    path: '/500',
    component: Exception500
  }
]

const normalRoutes = [
  {
    path: '/',
    exact: true,
    redirect: '/parent'
  },
  {
    path: '/user/login',
    exact: true,
    component: Login
  }
];


const combineRoutes = [
  ...authorizedRoutes,
  ...normalRoutes
];

export {
  authorizedRoutes,
  normalRoutes,
  combineRoutes
}