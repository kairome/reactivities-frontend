import api from 'api/apiRequests';

const clearAllNotifications = async () => {
  return api.delete('/current-user/notifications');
};

export default {
  name: 'clearAllNotifications',
  request: clearAllNotifications,
};
