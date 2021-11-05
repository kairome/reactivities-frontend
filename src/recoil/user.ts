import { atom } from 'recoil';
import { CurrentUser } from 'types/user';

export const currentUserState = atom<CurrentUser | null>({
  key: 'currentUser',
  default: null,
});
