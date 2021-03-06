import React, { useState } from 'react';

import s from './Dropdown.css';
import _ from 'lodash';
import useOutsideClick from 'hooks/useOutsideClick';

interface Props {
  renderDropdownControl: () => React.ReactNode,
  list: React.ReactNode[],
  controlClassName?: string,
}

const Dropdown: React.FC<Props> = (props) => {
  const { list } = props;
  const [show, setShow] = useState(false);
  const containerRef = useOutsideClick(() => setShow(false));

  const handleClick = () => {
    if (_.isEmpty(list)) {
      return;
    }

    setShow(!show);
  };

  const renderDropdown = () => {
    if (!show) {
      return null;
    }

    return (
      <div className={s.dropdown} onClick={(e) => e.stopPropagation()}>
        {list}
      </div>
    );
  };

  return (
    <div className={s.dropdownItem} onClick={handleClick} ref={containerRef}>
      {props.renderDropdownControl()}
      {renderDropdown()}
    </div>
  );
};

export default Dropdown;
