import React, { useEffect, useRef, useState } from 'react';

import s from './Dropdown.css';
import _ from 'lodash';

interface Props {
  renderDropdownControl: () => React.ReactNode,
  list: React.ReactNode[],
  controlClassName?: string,
}

const Dropdown: React.FC<Props> = (props) => {
  const { list } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current !== null && containerRef.current.contains((e.target as Node))) {
        return;
      }

      setShow(false);
    };

    window.addEventListener('mouseup', handleOutsideClick, true);

    return () => window.removeEventListener('mouseup', handleOutsideClick, true);
  }, []);

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
