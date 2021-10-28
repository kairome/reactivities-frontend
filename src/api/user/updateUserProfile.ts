import api from 'api/apiRequests';
import { UpdateUserPayload } from 'types/user';

const updateUserProfile = async (payload: UpdateUserPayload) => {
  return api.put('/current-user', payload);
};

export default {
  name: 'updateUserProfile',
  request: updateUserProfile,
};
