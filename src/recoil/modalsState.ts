import { atom, useRecoilState } from 'recoil';

type ModalsState = {
  [k: string]: boolean,
};

export const modalsState = atom<ModalsState>({
  key: 'modals',
  default: {},
});

export const useModal = (modalKey: string) => {
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
