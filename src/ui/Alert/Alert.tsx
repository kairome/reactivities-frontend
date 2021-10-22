import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import s from './Alert.css';
import { AlertItem } from 'types/entities';
import _ from 'lodash';

interface Props {
  alertItem: AlertItem,
  onRemove: () => void,
}

const Alert: React.FC<Props> = (props) => {
  const { alertItem } = props;
  const [show, setShow] = useState(false);
  const timeoutId = useRef(0);

  useEffect(() => {
    setShow(true);
    clearTimeout(timeoutId.current);
    const { timeout = 3 } = alertItem;

    if (timeout > 0) {
      timeoutId.current = _.delay(closeAlert, timeout * 1000);
    }

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  const closeAlert = () => {
    setShow(false);
    clearTimeout(timeoutId.current);
    timeoutId.current = _.delay(props.onRemove, 500);
  };

  const { type } = alertItem;
  const alertClasses = classNames(s.alertItem, {
    [s.success]: type === 'success',
    [s.info]: type === 'info',
    [s.error]: type === 'error',
    [s.show]: show,
  });

  return (
    <div className={alertClasses} onClick={closeAlert}>
      <div className={s.alertText}>{alertItem.title}</div>
    </div>
  );
};

export default Alert;
