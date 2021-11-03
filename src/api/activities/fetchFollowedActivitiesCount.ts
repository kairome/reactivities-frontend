import api from 'api/apiRequests';

const fetchFollowedActivitiesCount = async () => {
  return api.get('/activities/followed-count');
};

export default {
  name: 'fetchFollowedActivitiesCount',
  request: fetchFollowedActivitiesCount,
};
