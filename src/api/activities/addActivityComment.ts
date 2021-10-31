import api from 'api/apiRequests';
import { AddCommentPayload } from 'types/activity';

const addActivityComment = async (payload: AddCommentPayload) => {
  const { activityId, ...data } = payload;
  return api.post(`/activity/${activityId}/comments`, data);
};

export default {
  name: 'addActivityComment',
  request: addActivityComment,
};
