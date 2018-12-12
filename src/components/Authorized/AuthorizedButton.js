import React from 'react';
import {
  Button
} from 'antd';
import Authorized from './Authorized';

export default props => {
  const { authorities, children, ...restProps } = props;
  return (
    <Authorized 
      authorities={authorities} 
      target={<Button {...restProps}>{children}</Button>}
    />
  )
}

