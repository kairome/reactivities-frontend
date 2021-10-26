import api from 'api/apiRequests';

const leaveActivity = async (id: string) => {
  return api.put(`/activities/${id}/leave`);
};

export default {
  name: 'leaveActivity',
  request: leaveActivity,
};
