import api from 'api/apiRequests';

const fetchCurrentUser = async () => {
  return api.get('/current-user');
};

export default {
  name: 'fetchCurrentUser',
  request: fetchCurrentUser,
};
