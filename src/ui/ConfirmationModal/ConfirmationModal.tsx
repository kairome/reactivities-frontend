import React, { useEffect } from 'react';
import Modal from 'ui/Modal/Modal';
import { useModal } from 'recoil/modalsState';
import Button from 'ui/Button/Button';
import s from './ConfirmationModal.css';

interface Props {
  modalKey: string,
  title: string,
  text: string,
  status: string,
  action: () => void,
}

const ConfirmationModal: React.FC<Props> = (props) => {
  const { modalKey, status, title } = props;
  const { closeModal } = useModal(modalKey);

  useEffect(() => {
    if (status === 'success') {
      closeModal();
    }

    return () => {
      closeModal();
    };
  }, [status]);

  const isLoading = status === 'loading';

  return (
    <Modal modalKey={modalKey} title={title}>
      <div className={s.text}>{props.text}</div>
      <div className={s.buttons}>
        <Button theme="action" text="Confirm" onClick={props.action} isLoading={isLoading} />
        <Button theme="danger" text="Cancel" onClick={() => closeModal()} disabled={isLoading} />
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
