import React from 'react';
import { useModal } from 'recoil/modalsState';

import s from './Modal.css';

interface Props {
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
      <div className={s.modalCover} onClick={closeModal} />
      <div className={s.modalBody}>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
