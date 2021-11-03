import api from 'api/apiRequests';

const fetchUserActivitiesStats = async (id: string) => {
  return api.get(`/user-profile/${id}/stats`);
};

export default {
  name: 'fetchUserActivitiesStats',
  request: fetchUserActivitiesStats,
};
