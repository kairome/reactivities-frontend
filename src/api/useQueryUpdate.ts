import { useQueryClient } from 'react-query';

export default () => {
  const queryClient = useQueryClient();

  return (name: string | [string, any], data: any) => {
    queryClient.setQueryData(name, data);
  };
};
