import { atom, useRecoilState } from 'recoil';

import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { AlertItem } from 'types/entities';


export const alertState = atom<AlertItem[]>({
  key: 'alerts',
  default: [],
});

export const useAlert = () => {
  const [alerts, setAlerts] = useRecoilState(alertState);

  const spawnAlert = (alert: Omit<AlertItem, 'id'>) => {
    setAlerts([
      ...alerts,
      {
        ...alert,
        id: uuid(),
      },
    ]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => _.filter(prevAlerts, a => a.id !== id));
  };

  return {
    alerts,
    spawnAlert,
    removeAlert,
  };
};
