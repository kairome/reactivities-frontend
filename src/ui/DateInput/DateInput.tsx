import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import dayjs, { Dayjs } from 'dayjs';

import s from './DateInput.css';
import _ from 'lodash';

interface CommonProps {
  format?: string,
  errors?: string[],
}

interface DateInputProps extends CommonProps {
  value: string,
  onChange: (v: string) => void,
  isRange?: false,
}

interface DateRangeProps extends CommonProps {
  isRange: true,
}

const DateInput: React.FC<DateInputProps | DateRangeProps> = (props) => {
  const { format = 'dd/MM/yy HH:mm' } = props;

  const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs());

  const convertDate = (d: Dayjs) => d.format('YYYY-MM-DD[T]HH:mm:ss');

  useEffect(() => {
    if (!props.isRange && dateFrom) {
      props.onChange(convertDate(dateFrom));
    }
  }, []);

  const handleDateInputChange = (v: Date | null) => {
    const dayjsValue = v ? dayjs(v) : null;
    if (!props.isRange) {
      setDateFrom(dayjsValue);
      props.onChange(dayjsValue ? convertDate(dayjsValue) : '');
    }
  };

  const renderErrors = () => {
    const dateInvalid = dateFrom && dateFrom.isValid() ? '' : 'Invalid date';
    if (_.isEmpty(props.errors) && !dateInvalid) {
      return null;
    }

    const allErrors = props.errors ? [...props.errors, dateInvalid] : [dateInvalid];
    return (
      <div className={s.errors}>{_.map(allErrors, e => (<div key={e} className={s.error}>{e}</div>))}</div>
    );
  };

  if (!props.isRange) {
    return (
      <div className={s.dateInputWrapper}>
        <div className={s.inputLabel}>Date</div>
        <DateTimePicker
          value={dateFrom ? dateFrom.toDate() : null}
          onChange={handleDateInputChange}
          format={format}
        />
        {renderErrors()}
      </div>
    );
  }

  if (props.isRange) {
    return null;
  }

  return null;
};

export default DateInput;
