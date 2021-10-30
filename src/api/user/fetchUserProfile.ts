import api from 'api/apiRequests';

const fetchUserProfile = async (id: string) => {
  return api.get(`/user-profile/${id}`);
};

export default {
  name: 'fetchUserProfile',
  request: fetchUserProfile,
};
