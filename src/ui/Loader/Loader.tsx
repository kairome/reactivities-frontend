import React from 'react';

import s from './Loader.css';

interface Props {
  size?: 'sm' | 'lg'
}

const Loader: React.FC<Props> = (props) => {
  const { size = 'lg' } = props;
  return (
    <div className={size === 'sm' ? s.loaderSm : s.loader}>
      <div />
      <div />
    </div>
  );
};

export default Loader;
