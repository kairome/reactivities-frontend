import api from 'api/apiRequests';

const activateActivity = async (id: string) => {
  return api.put(`/activities/${id}/activate`);
};

export default {
  name: 'activateActivity',
  request: activateActivity,
};
