import React from 'react';

import s from './Loader.css';
import classNames from 'classnames';

interface Props {
  size?: 'sm' | 'lg' | 'xxl',
  className?: string,
}

const Loader: React.FC<Props> = (props) => {
  const { size = 'lg' } = props;

  const loaderClasses = classNames(props.className, {
    [s.loader]: size === 'lg',
    [s.loaderSm]: size === 'sm',
    [s.loaderXxl]: size === 'xxl',
  });
  return (
    <div className={loaderClasses}>
      <div />
      <div />
    </div>
  );
};

export default Loader;
