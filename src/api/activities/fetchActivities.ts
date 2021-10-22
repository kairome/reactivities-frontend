import api from 'api/apiRequests';
import { ActivityFiltersPayload } from 'types/activity';
import queryString from 'query-string';

const fetchActivities = async (filters: ActivityFiltersPayload) => {
  return api.get(`/activities?${queryString.stringify(filters)}`);
};

export default {
  name: 'fetchActivities',
  request: fetchActivities,
};
