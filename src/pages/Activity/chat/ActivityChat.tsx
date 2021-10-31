import React, { useEffect, useRef, useState } from 'react';
import { ActivityComment } from 'types/activity';
import useChatSignalr from 'utils/useChatSignalr';

import s from './ActivityChat.css';
import _ from 'lodash';

import dayjs from 'dayjs';
import { Tooltip } from 'react-tippy';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'recoil/user';
import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';
import { InputEvent } from 'types/entities';
import { useMutation } from 'react-query';
import { addActivityComment } from 'api/activities';

interface Props {
  activityId: string,
  activityComments: ActivityComment[],
}

const ActivityChat: React.FC<Props> = (props) => {
  const { activityComments, activityId } = props;
  const [comments, setComments] = useState(activityComments);
  const currentUser = useRecoilValue(currentUserState);
  const [messageText, setMessageText] = useState('');
  const chatContainer = useRef<HTMLDivElement | null>(null);

  const sendMessageMutation = useMutation(addActivityComment.name, addActivityComment.request, {
    onSuccess: () => {
      setMessageText('');
      chatContainer.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  });

  const hubConnection = useChatSignalr(activityId);

  useEffect(() => {
    if (hubConnection === null) {
      return;
    }

    hubConnection.start();
    hubConnection.on('newChatMessage', (newComment: ActivityComment) => {
      setComments((oldComments) => [newComment, ...oldComments]);
    });
  }, [hubConnection]);

  const handleMessageChange = (e: InputEvent) => {
    setMessageText(e.currentTarget.value);
  };

  const handleSendMessage = () => {
    sendMessageMutation.mutate({
      activityId,
      Body: messageText,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      handleSendMessage();
    }
  };

  const renderComments = () => {
    if (_.isEmpty(comments)) {
      return (
        <div>
          No comments yet for this activity :(
          <br />
          Start off the conversation by sending a message!
        </div>
      );
    }
    return _.map(comments, (comment) => {
      const profileSrc = comment.AuthorProfileUrl ?? '/assets/default.jpeg';
      const date = dayjs(comment.CreatedAt);

      const isAuthor = currentUser.Id === comment.AuthorId;
      const userName = isAuthor ? 'You' : comment.AuthorName;

      return (
        <div key={comment.Id} className={isAuthor ? s.myMessage : s.chatMessage}>
          <div className={s.messageHeader}>
            <img className={s.messageProfileImg} src={profileSrc} alt={comment.AuthorName} />
            <div>
              <div className={s.messageName}>{userName}</div>
              <Tooltip
                title={date.format('DD MMMM YYYY, HH:mm')}
                position="top-start"
                trigger="mouseenter"
              >
                <div className={s.messageDate}>{date.fromNow()}</div>
              </Tooltip>
            </div>
          </div>
          <div className={s.messageBody}>
            {comment.Body}
          </div>
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <div className={s.chatContainer}>
        <div className={s.chat} ref={chatContainer}>
          {renderComments()}
        </div>
        <div className={s.chatMessageInputContainer}>
          <Input
            type="text"
            label="Send a message for this activity"
            value={messageText}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            textArea
          />
          <Button
            theme="action"
            text="Send"
            disabled={!messageText.trim()}
            onClick={handleSendMessage}
            isLoading={sendMessageMutation.isLoading}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ActivityChat;
