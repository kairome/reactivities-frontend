import api from 'api/apiRequests';

const unfollowActivity = async (id: string) => {
  return api.put(`/activities/${id}/unfollow`);
};

export default {
  name: 'unfollowActivity',
  request: unfollowActivity,
};
