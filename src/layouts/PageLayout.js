import React from 'react';
import styles from './PageLayout.less';
import Breadcrumb from '@/components/Breadcrumb'

export default props => {
  return (
    <div className='page-layout'>
      <div className={styles.pageHeader}>
        <Breadcrumb/>
      </div>
      <div className={styles.pageContent}>{props.children}</div>
    </div>
  )
}