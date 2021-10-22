import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import s from './Checkbox.css';

interface Props {
  id?: string,
  label: string,
  isChecked: boolean,
  onChange: (e: React.FormEvent<HTMLInputElement>) => void,
}

const Checkbox: React.FC<Props> = (props) => {
  const { label, isChecked, ...rest } = props;

  return (
    <label className={s.checkboxWrapper}>
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
