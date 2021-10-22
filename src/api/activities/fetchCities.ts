import api from 'api/apiRequests';

const fetchCities = async () => {
  return api.get('/activities/cities');
};

export default {
  name: 'fetchCities',
  request: fetchCities,
};
