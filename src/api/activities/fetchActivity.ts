import api from 'api/apiRequests';

const fetchActivity = async (id: string) => {
  return api.get(`/activities/${id}`);
};

export default {
  name: 'fetchActivity',
  request: fetchActivity,
};
