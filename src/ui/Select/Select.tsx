import React, { useMemo } from 'react';
import { MultiSelectOption, SelectOption, SingleSelectOption } from 'types/entities';

import RSelect from 'react-select';

import _ from 'lodash';

import s from './Select.css';

interface CommonSelectProps {
  options: SelectOption[],
  clear?: boolean,
  label: string,
  placeholder?: string,
  className?: string,
}

interface SingleSelectProps extends CommonSelectProps {
  value?: string,
  onChange: (v: SingleSelectOption) => void,
  multi?: false,
}

interface MultiSelectProps extends CommonSelectProps {
  onChange: (v: MultiSelectOption) => void,
  value?: string[],
  multi: true,
}

const Select: React.FC<SingleSelectProps | MultiSelectProps> = (props) => {
  const { clear = true, value, options } = props;

  const values = useMemo(() => {
    if (props.multi) {
      return _.reduce(value, (acc, v) => {
        const current = _.find(options, o => o.value === v);
        if (current) {
          return [
            ...acc,
            current,
          ];
        }

        return acc;
      }, [] as MultiSelectOption);
    }

    return _.find(props.options, o => o.value === value);
  }, [options, value]);

  return (
    <div className={props.className}>
      <div className={s.label}>{props.label}</div>
      <RSelect
        value={values}
        options={options}
        onChange={props.onChange as any}
        placeholder={props.placeholder}
        isMulti={props.multi}
        isClearable={clear}
      />
    </div>
  );
};

export default Select;
