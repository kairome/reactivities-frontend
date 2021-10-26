import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import s from './Checkbox.css';

import classNames from 'classnames';

interface Props {
  id?: string,
  label: string,
  isChecked: boolean,
  className?: string,
  onChange: (e: React.FormEvent<HTMLInputElement>) => void,
}

const Checkbox: React.FC<Props> = (props) => {
  const { label, isChecked, className, ...rest } = props;

  return (
    <label className={classNames(s.checkboxWrapper, className)}>
      <div className={s.checkboxLabel}>{label}</div>
      <input
        type="checkbox"
        {...rest}
        checked={isChecked}
        className={s.checkboxInput}
      />
      <div className={s.checkboxMaskContainer}>
        <FontAwesomeIcon
          icon={faCheck}
          className={s.checkIcon}
        />
      </div>
    </label>
  );
};

export default Checkbox;
