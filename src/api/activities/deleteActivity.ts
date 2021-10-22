import api from 'api/apiRequests';

const deleteActivity = async (id: string) => {
  return api.delete(`/activities/${id}`);
};

export default {
  name: 'deleteActivity',
  request: deleteActivity,
};
