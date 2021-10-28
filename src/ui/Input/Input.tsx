import React from 'react';

import s from './Input.css';
import _ from 'lodash';
import classNames from 'classnames';
import { InputEvent, InputEventElement } from 'types/entities';

interface CommonInputProps {
  type: string,
  value: string,
  label: string,
  placeholder?: string,
  required?: boolean,
  errors?: string[],
  className?: string,
  onBlur?: (e: InputEvent) => void,
  onKeyDown?: (e: React.KeyboardEvent<InputEventElement>) => void,
  disabled?: boolean,
  autoFocus?: boolean,
}

interface InputProps extends CommonInputProps {
  onChange: (e: React.FormEvent<HTMLInputElement>) => void,
  textArea?: false,
}

interface TextareaProps extends CommonInputProps {
  onChange: (e: React.FormEvent<HTMLTextAreaElement>) => void,
  textArea: true,
}

const Input: React.FC<InputProps | TextareaProps> = (props) => {
  const { label, textArea, errors, className, ...rest } = props;

  const renderErrors = () => {
    if (_.isEmpty(errors)) {
      return null;
    }

    const list = _.map(errors, e => (<div key={e} className={s.error}>{e}</div>));

    return (
      <div className={s.errors}>{list}</div>
    );
  };

  const renderInput = () => {
    if (textArea) {
      return (
        <textarea {...rest} onChange={props.onChange} className={s.textArea} />
      );
    }

    return (
      <input {...rest} onChange={props.onChange} className={s.input} />
    );
  };
  return (
    <div className={classNames(s.inputWrapper, className)}>
      <label>
        <div className={s.inputLabel}>
          {label}{props.required ? (<span className={s.required}> *</span>) : null}
        </div>
        {renderInput()}
      </label>
      {renderErrors()}
    </div>
  );
};

export default Input;
