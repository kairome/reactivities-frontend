import useSignalr from './useSignalr';
import { useEffect } from 'react';

const useChatSignalr = (activityId: string) => {
  const { connection, setUrl } = useSignalr();

  useEffect(() => {
    if (activityId) {
      setUrl(`chat?activityId=${activityId}`);
    }
  }, [activityId]);

  return connection;
};

export default useChatSignalr;
