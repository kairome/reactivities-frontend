import api from 'api/apiRequests';

const uploadProfilePhoto = async (payload: FormData) => {
  return api.post('/current-user/profile-photo/', payload);
};

export default {
  name: 'uploadProfilePhoto',
  request: uploadProfilePhoto,
};
