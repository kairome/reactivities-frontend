import React, { useEffect, useMemo, useState } from 'react';
import useNotificationsSignalr from 'utils/useNotificationsSignalr';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'recoil/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import s from './Notifications.css';
import { CurrentUser, UserNotification, UserNotificationType } from 'types/user';
import _ from 'lodash';
import useOutsideClick from 'utils/useOutsideClick';
import { useMutation } from 'react-query';
import { clearAllNotifications, clearNotification, markNotificationAsRead } from 'api/notifications';
import handleApiErrors from 'api/handleApiErrors';
import { useAlert } from 'recoil/alertState';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useBrowserNotifications from 'utils/useBrowserNotifications';

const Notifications: React.FC = () => {
  const currentUser = useRecoilValue(currentUserState);
  const { spawnAlert } = useAlert();

  const { spawnNotification } = useBrowserNotifications();

  const hubConnection = useNotificationsSignalr(currentUser?.Id);
  const [showNotifications, setShowNotifications] = useState(false);

  const [allNotifications, setAllNotifications] = useState<UserNotification[]>([]);

  const containerRef = useOutsideClick(() => setShowNotifications(false));

  const clearAllMutation = useMutation(clearAllNotifications.name, clearAllNotifications.request, {
    onSuccess: () => {
      setAllNotifications([]);
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Failed to clear notifications', spawnAlert);
    },
  });

  const clearMutation = useMutation(clearNotification.name, clearNotification.request, {
    onSuccess: (data: CurrentUser) => {
      setAllNotifications(data.Notifications);
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Failed to clear notification', spawnAlert);
    },
  });

  const markMutation = useMutation(markNotificationAsRead.name, markNotificationAsRead.request, {
    onSuccess: (data: CurrentUser) => {
      setAllNotifications(data.Notifications);
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Failed to mark notification as read', spawnAlert);
    },
  });

  useEffect(() => {
    if (hubConnection === null) {
      return;
    }

    hubConnection.start();

    hubConnection.on('activityUpdated', (data: UserNotification) => {
      setAllNotifications((oldNotifications) => ([data, ...oldNotifications]));
      spawnNotification(getBrowserNotificationText(data));
    });
  }, [hubConnection]);

  useEffect(() => {
    if (currentUser) {
      setAllNotifications(currentUser.Notifications);
    }
  }, [currentUser]);

  const hasNewNotifications = useMemo(() => {
    return _.some(allNotifications, n => !n.IsRead);
  }, [allNotifications]);

  const handleClearAll = () => {
    if (clearAllMutation.isLoading) {
      return;
    }

    clearAllMutation.mutate();
  };

  const handleClear = (id: string) => {
    if (clearMutation.isLoading) {
      return;
    }

    clearMutation.mutate(id);
  };

  const handleMarkAsRead = (id: string) => {
    if (markMutation.isLoading) {
      return;
    }

    markMutation.mutate(id);
  };

  const handleNotificationClick = (id: string) => {
    handleMarkAsRead(id);
    setShowNotifications(false);
  };

  const renderClearAll = () => {
    if (_.isEmpty(allNotifications)) {
      return null;
    }

    return (
      <div onClick={handleClearAll} className={s.clearAllBtn}>
        Clear all notifications
      </div>
    );
  };

  const getBrowserNotificationText = (n: UserNotification) => {
    const activityText = `Activity "${n.ActivityTitle}"`;
    switch (n.Type) {
      case UserNotificationType.NewMessages:
        return `${activityText} has new messages`;
      case UserNotificationType.Edited:
        return `${activityText} has been updated`;
      case UserNotificationType.Deleted:
        return `${activityText} has been deleted`;
      case UserNotificationType.Cancelled:
        return `${activityText} has been cancelled`;
      case UserNotificationType.Activated:
        return `${activityText} has been activated`;
    }
  };

  const renderNotificationType = (type: UserNotificationType) => {
    switch (type) {
      case UserNotificationType.Activated:
        return (
          <div className={s.actionActivityType}>
            Activity was activated
          </div>
        );
      case UserNotificationType.Cancelled:
        return (
          <div className={s.deletedActivityType}>
            Activity was cancelled
          </div>
        );
      case UserNotificationType.Deleted:
        return (
          <div className={s.deletedActivityType}>
            Activity was deleted
          </div>
        );
      case UserNotificationType.Edited:
        return (
          <div className={s.actionActivityType}>
            Activity was updated
          </div>
        );
      case UserNotificationType.NewMessages:
        return (
          <div className={s.messagesActivityType}>
            There are new messages in activity chat
          </div>
        );
      default:
        return null;
    }
  };

  const renderNotifications = () => {
    if (!showNotifications) {
      return null;
    }

    const list = _.map(allNotifications, (notification) => {
      const {
        ActivityTitle,
        ActivityId,
        Type,
        Id,
      } = notification;

      const activityName = Type === UserNotificationType.Deleted ? (
        <div className={s.deletedActivityName}>
          {ActivityTitle}
        </div>
      ) : (
        <Link
          to={`/activity/${ActivityId}`}
          className={s.notificationActivityName}
          onClick={() => handleNotificationClick(notification.Id)}
        >
          {ActivityTitle}
        </Link>
      );

      const markBtn = !notification.IsRead ? (
        <div className={s.markBtn} onClick={() => handleMarkAsRead(Id)}>
          Mark as read
        </div>
      ) : null;

      const notificationClasses = classNames(s.notification, {
        [s.readNotification]: notification.IsRead,
      });

      return (
        <div key={Id} className={notificationClasses}>
          <div className={s.notificationHeader}>
            {activityName}
            <div className={s.actionBtns}>
              {markBtn}
              <div className={s.markBtn} onClick={() => handleClear(Id)}>
                Clear
              </div>
            </div>
          </div>
          {renderNotificationType(Type)}
          <div className={s.notificationDate}>
            {dayjs(notification.CreatedAt).format('MMMM DD, HH:mm')}
          </div>
        </div>
      );
    });

    return (
      <div className={s.notifications}>
        {renderClearAll()}
        {_.isEmpty(list) ? 'All clear, no notifications yet!' : list}
      </div>
    );
  };

  const renderIndicator = () => {
    if (!hasNewNotifications) {
      return null;
    }

    return (<div className={s.indicator} />);
  };

  return (
    <div className={s.notificationContainer} ref={containerRef}>
      <FontAwesomeIcon
        icon={faBell}
        className={s.notificationIcon}
        onClick={() => setShowNotifications(!showNotifications)}
      />
      {renderIndicator()}
      {renderNotifications()}
    </div>
  );
};

export default Notifications;
