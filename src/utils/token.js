import Cookie from 'js-cookie';

const TOKENKEY = 'USER_TOKEN'

export function setToken(token) {
  Cookie.set(TOKENKEY, token);
}

export function getToken() {
  return Cookie.get(TOKENKEY);
}

export function removeToken() {
  Cookie.remove(TOKENKEY);
}