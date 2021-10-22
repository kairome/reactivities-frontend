import { atom } from 'recoil';

type ActivitiesFormState = 'add' | 'edit';

export default atom<ActivitiesFormState>({
  key: 'activitiesForm',
  default: 'add',
});
