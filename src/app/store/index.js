import { init } from '@rematch/core';
import { createHashHistory } from 'history';
import  createLoadingPlugin  from '@rematch/loading';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import app from './models/app';

const history = createHashHistory();

const loadingOptions = {}

const loading = createLoadingPlugin(loadingOptions)

const redux = {
  middlewares: [routerMiddleware(history)],
  reducers: {
    router: connectRouter(history)
  }
}

const store = init({
  models: {
    app
  },
  redux,
  plugins: [loading]
});

const { dispatch, getState } = store

export { 
  dispatch,
  history, 
  getState 
};
export default store