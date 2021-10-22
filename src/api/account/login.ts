import api from 'api/apiRequests';
import { LoginPayload } from 'types/account';

const login = async (payload: LoginPayload) => {
  return api.post('/account/login', payload);
};

export default {
  name: 'login',
  request: login,
};
