import api from 'api/apiRequests';

const markNotificationAsRead = async (id: string) => {
  return api.put(`/current-user/notifications/${id}/read`);
};

export default {
  name: 'markNotificationAsRead',
  request: markNotificationAsRead,
};
