import api from 'api/apiRequests';
import { CreateActivityPayload } from 'types/activity';

const createEditActivity = async (payload: CreateActivityPayload) => {
  const { Id } = payload;
  if (Id) {
    return api.put(`/activities/${Id}`, payload);
  }

  return api.post('/activities', payload);
};

export default {
  name: 'createEditActivity',
  request: createEditActivity,
};
