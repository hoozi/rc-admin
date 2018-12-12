import React from 'react';
import { Link } from 'react-router-dom';
import Exception from '@/components/Exception';

const Exception403 = () => (
  <Exception
    type="403"
    linkElement={Link}
  />
);

export default Exception403;
