import React from 'react';

import _ from 'lodash';

import s from './Radio.css';

interface RadioItem {
  label: string,
  value: string,
  id?: string,
}

interface Props {
  name: string,
  items: RadioItem[],
  value: string,
  onChange: (e: React.FormEvent<HTMLInputElement>) => void,
}

const Radio: React.FC<Props> = (props) => {
  const renderItems = () => {
    return _.map(props.items, (item) => {
      return (
        <label className={s.radioItem} key={item.value}>
          <div className={s.radioMaskContainer}>
            <input
              type="radio"
              {...item}
              checked={props.value === item.value}
              name={props.name}
              onChange={props.onChange}
              className={s.radioInput}
            />
            <div className={s.radioMask} />
          </div>
          <span>{item.label}</span>
        </label>
      );
    });
  };

  return (
    <div className={s.radioItems}>
      {renderItems()}
    </div>
  );
};

export default Radio;
