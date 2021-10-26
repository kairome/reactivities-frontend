import api from 'api/apiRequests';

const cancelActivity = async (id: string) => {
  return api.put(`/activities/${id}/cancel`);
};

export default {
  name: 'cancelActivity',
  request: cancelActivity,
};
