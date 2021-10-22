import { SpawnAlert } from 'types/entities';

export default (errorMsg: string, defaultMsg: string, spawnAlert: SpawnAlert) => {
  spawnAlert({
    type: 'error',
    title: errorMsg ? errorMsg : defaultMsg,
    timeout: 5,
  });
};
