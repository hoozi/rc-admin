import pathToRegexp from 'path-to-regexp';

/**
 * @param {Array} menus 嵌套的菜单数组
 * @param {String} parentPath 上层路径
 * @returns {Array} 
 */
export function formatterMenus(menus, parentPath = '/', parentAuthority) {
  return menus.map(item => {
    let { path } = item;
    
    if(!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatterMenus(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export function isUrl(string) {
  // eslint-disable-next-line
  const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
  // eslint-disable-next-line
  const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
  // eslint-disable-next-line
  const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
  if (typeof string !== 'string') {
    return false;
  }

  const match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) ||
      nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}

export function urlToList(path) {
  const urlList = path.split('/').filter(item => item);
  return urlList.map((url, index) => {
    return `/${urlList.slice(0, index+1).join('/')}`
  })
}

/**
 * 扁平化菜单path
 * @param {Object} menu 菜单对象
 */
export function getFlatMenuKeys(menu) {
  return menu
    .reduce((keys, item) => {
      keys.push(item.path);
      if (item.children) {
        return keys.concat(getFlatMenuKeys(item.children));
      }
      return keys;
    }, []);
}

/**
 * @param {Array} flatMenuKeys 扁平化菜单path(Array)
 * @param {Array} paths 需要test的url list e.g:['/a','/a/b]
 */
export function getMenuMatchKeys (flatMenuKeys, paths) {
  return paths
    .reduce((matchKeys, path) => (
      matchKeys.concat(
        flatMenuKeys.filter(item => pathToRegexp(item).test(path))
    )), []);
}