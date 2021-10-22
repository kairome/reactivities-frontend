import api from 'api/apiRequests';

const logout = async () => {
  return api.post('/account/logout');
};

export default {
  name: 'logout',
  request: logout,
};
