import useSignalr from 'utils/useSignalr';
import { useEffect } from 'react';

const useNotificationsSignalr = (userId: string) => {
  const { connection, setUrl } = useSignalr();

  useEffect(() => {
    if (userId) {
      setUrl(`notifications?userId=${userId}`);
    }
  }, [userId]);

  return connection;
};

export default useNotificationsSignalr;
