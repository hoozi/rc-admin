import { fromJS } from 'immutable';
import logo from '@/assets/logo.svg';
const state = fromJS({
  collapsed: false,
  appName: 'ReactAdmin',
  logo: '',
  fixedHeader: true,
  fixedSider: true
})

const reducers = {
  toggleCollapsed(state, payload) {
    return state.set('collapsed', payload);
  }
}

const effects = {}

export default {
  state,
  reducers,
  effects
}