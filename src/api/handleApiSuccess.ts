import { SpawnAlert } from 'types/entities';

export default (message: string, spawnAlert: SpawnAlert) => {
  spawnAlert({
    type: 'success',
    title: message,
  });
};
