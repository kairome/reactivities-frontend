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

  const showModal = () => {
    setState({ ...state, [modalKey]: true });
  };

  const closeModal = () => {
    setState({ ...state, [modalKey]: false });
  };

  const currentState = state[modalKey];

  return {
    isModalOpen: currentState !== undefined ? currentState : false,
    closeModal,
    showModal,
  };
};
