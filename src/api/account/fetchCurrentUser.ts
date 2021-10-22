import api from 'api/apiRequests';
import { LoginPayload } from 'types/account';

const fetchCurrentUser = async () => {
  return api.get('/users/current');
};

export default {
  name: 'fetchCurrentUser',
  request: fetchCurrentUser,
};
