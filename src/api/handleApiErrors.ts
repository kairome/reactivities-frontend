import { ApiError, SpawnAlert } from 'types/entities';

export default (error: ApiError, defaultMsg: string, spawnAlert: SpawnAlert) => {
  const { data } = error;
  spawnAlert({
    type: 'error',
    title: data.Message ? data.Message : defaultMsg,
    timeout: 5,
  });
};
