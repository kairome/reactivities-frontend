import api from 'api/apiRequests';

const followActivity = async (id: string) => {
  return api.put(`/activities/${id}/follow`);
};

export default {
  name: 'followActivity',
  request: followActivity,
};
