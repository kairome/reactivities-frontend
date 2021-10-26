import api from 'api/apiRequests';

const attendActivity = async (id: string) => {
  return api.put(`/activities/${id}/attend`);
};

export default {
  name: 'attendActivity',
  request: attendActivity,
};
