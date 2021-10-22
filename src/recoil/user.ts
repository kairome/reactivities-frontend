import { atom } from 'recoil';
import { CurrentUser } from 'types/account';

export const currentUserState = atom<CurrentUser>({
  key: 'currentUser',
  default: {
    DisplayName: '',
    Email: null,
    Id: '',
  },
});
