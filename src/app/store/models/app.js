import { fromJS } from 'immutable'
const state = fromJS({
  collapsed: false,
  appName: 'React Admin',
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