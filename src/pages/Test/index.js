import React from 'react';
import { AuthorizedButton } from '@/components/Authorized';

export default props => (
  <div>
    <AuthorizedButton type='primary' authorities='1'>Test Click1</AuthorizedButton>
  </div>
);
