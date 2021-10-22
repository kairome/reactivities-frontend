import api from 'api/apiRequests';
import { RegisterPayload } from 'types/account';

const register = async (payload: RegisterPayload) => {
  return api.post('/account/register', payload);
};

export default {
  name: 'register',
  request: register,
};
