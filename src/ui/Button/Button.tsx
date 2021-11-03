import React from 'react';

import s from './Button.css';

import classNames from 'classnames';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'ui/Loader/Loader';

interface Props {
  type?: 'button' | 'submit',
  text?: string,
  onClick?: () => void,
  disabled?: boolean,
  className?: string,
  icon?: IconDefinition,
  iconClassName?: string,
  theme: 'primary' | 'action' | 'danger' | 'footnote',
  isLoading?: boolean,
  title?: string,
}

const Button: React.FC<Props> = (props) => {
  const { text, className, icon, iconClassName, theme, isLoading, disabled, ...rest } = props;

  const btnText = icon ? (
    <FontAwesomeIcon
      icon={icon}
      className={iconClassName}
    />
  ) : text;

  const btnClasses = classNames(s.btn, className, {
    [s.iconBtn]: icon !== undefined,
    [s.footnoteTheme]: theme === 'footnote',
    [s.primaryTheme]: theme === 'primary',
    [s.actionTheme]: theme === 'action',
    [s.dangerTheme]: theme === 'danger',
  });

  return (
    <button {...rest} disabled={disabled || isLoading} className={btnClasses}>
      {btnText}
      {isLoading ? (<Loader size="sm" />) : null}
    </button>
  );
};

export default Button;
