import { atom } from 'recoil';

type ModalsState = {
  [k: string]: boolean,
};

export default atom<ModalsState>({
  key: 'modals',
  default: {},
});
