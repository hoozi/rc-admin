import React from 'react';
import { AuthorizedButton } from '@/components/Authorized';
import PageLayout from '@/layouts/PageLayout';

export default props => (
  <PageLayout>
    <AuthorizedButton type='primary' authorities='1'>Test Click2</AuthorizedButton>
  </PageLayout>
);
