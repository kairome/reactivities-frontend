import api from 'api/apiRequests';

const fetchCategories = async () => {
  return api.get('/activities/categories');
};

export default {
  name: 'fetchCategories',
  request: fetchCategories,
};
