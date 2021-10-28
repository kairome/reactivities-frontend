import api from 'api/apiRequests';

const setUserProfilePhoto = async (id: string) => {
  return api.put(`/current-user/profile-photo/${id}`);
};

export default {
  name: 'setUserProfilePhoto',
  request: setUserProfilePhoto,
};
