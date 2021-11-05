import React, { useContext } from 'react';
import { ScrollTopContext } from 'context/ScrollTopProvider';
import s from './ScrollTopButton.css';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

interface Props {
  position?: 'fixed' | 'absolute',
  className?: string,
}

const ScrollTopButton: React.FC<Props> = (props) => {
  const { position = 'fixed' } = props;
  const { isVisible, scrollToTop } = useContext(ScrollTopContext);

  if (!isVisible) {
    return null;
  }

  const containerClasses = classNames(props.className, {
    [s.fixedContainer]: position === 'fixed',
    [s.absoluteContainer]: position === 'absolute',
  });
  return (
    <div
      onClick={scrollToTop}
      className={containerClasses}>
      <button type="button" className={s.btn}>
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
};

export default ScrollTopButton;
