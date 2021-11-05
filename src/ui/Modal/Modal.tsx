import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import s from './Modal.css';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useModal from 'hooks/useModal';

interface Props {
  title: string,
  modalKey: string,
  children: React.ReactNode,
}

const Modal: React.FC<Props> = (props) => {
  const { isModalOpen, closeModal } = useModal(props.modalKey);

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className={s.modal}>
      <div className={s.modalCover} onClick={() => closeModal()} />
      <div className={s.modalBody}>
        <div className={s.modalHeader}>
          <div className={s.modalTitle}>{props.title}</div>
          <FontAwesomeIcon icon={faTimes} onClick={() => closeModal()} className={s.modalClose} />
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
