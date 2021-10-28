import api from 'api/apiRequests';

const deleteUserPhoto = async (id: string) => {
  return api.delete(`/current-user/photo/${id}`);
};

export default {
  name: 'deleteUserPhoto',
  request: deleteUserPhoto,
};
