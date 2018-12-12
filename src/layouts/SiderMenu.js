import React, { Component } from 'react';
import {
  Layout
} from 'antd';
import styles from './SiderMenu.less';
import classNames from 'classnames';
import menuData from '@/app/menu';
import MenuTree from '@/components/MenuTree';

const { Sider } = Layout

export default class SiderMenu extends Component {
  render() {
    const { width, fixed, theme, pathname, ...restProps } = this.props;
    const siderClassNames = classNames(styles.siderWrap, {
      [styles.siderFixed]: fixed,
      [styles.siderLight]: theme === 'light'
    });
    return (
      <Sider
        width={width}
        collapsedWidth={64}
        theme={theme}
        className={siderClassNames}
        {...restProps}
      >
        <MenuTree
          pathname={pathname}
          menuData={menuData}
        />
      </Sider>
    )
  }
}