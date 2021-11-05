import { useRecoilState } from 'recoil';
import modalsState from 'recoil/modalsState';

const useModal = (modalKey: string) => {
  const [state, setState] = useRecoilState(modalsState);

  const showModal = (key?: string) => {
    const modalName = typeof key === 'string' ? key : modalKey;
    setState({ ...state, [modalName]: true });
  };

  const closeModal = (key?: string) => {
    const modalName = typeof key === 'string' ? key : modalKey;
    setState({ ...state, [modalName]: false });
  };

  const currentState = state[modalKey];

  return {
    isModalOpen: currentState !== undefined ? currentState : false,
    closeModal,
    showModal,
  };
};

export default useModal;
