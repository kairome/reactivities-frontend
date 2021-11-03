import api from 'api/apiRequests';

const clearNotification = async (id: string) => {
  return api.delete(`/current-user/notifications/${id}`);
};

export default {
  name: 'clearNotification',
  request: clearNotification,
};
