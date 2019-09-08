import { Icon, Spin } from 'antd';
import React from 'react';

const Loading = ({ pastDelay }) => {
  if (pastDelay)
    return <Spin indicator={<Icon type="loading" spin />} />;
  else
    return null;
};

export default Loading;