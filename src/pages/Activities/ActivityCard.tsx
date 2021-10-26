import React from 'react';
import { ActivityItem } from 'types/activity';
import _ from 'lodash';
import s from 'pages/Activities/Activities.css';
import dayjs from 'dayjs';
import Button from 'ui/Button/Button';
import { faEye, faPenNib, faTrash, faHouseUser, faBriefcase, faBan } from '@fortawesome/free-solid-svg-icons';
import history from 'utils/history';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AttendeesDropdown from 'pages/Activities/AttendeesDropdown';

interface Props {
  activity: ActivityItem,
  currentUserId: string,
  onEdit: (a: ActivityItem) => void,
  onDelete: (a: ActivityItem) => void,
}

const ActivityCard: React.FC<Props> = (props) => {
  const { activity, currentUserId } = props;

  const date = dayjs(activity.Date);
  const isHost = currentUserId === activity.AuthorId;

  const renderAttendance = () => {
    const { Attendees } = activity;

    const hostInfo = isHost ? (
      <div className={s.hostInfo}>
        <FontAwesomeIcon className={s.hostIcon} icon={faHouseUser} />
        <span>You are host</span>
      </div>
    ) : null;

    const isAttending = _.find(Attendees, a => a.UserId === currentUserId);

    const attendingInfo = isAttending ? (
      <div className={s.attendingInfo}>
        <FontAwesomeIcon className={s.attendingIcon} icon={faBriefcase} />
        <span>You are attending</span>
      </div>
    ) : null;

    return (
      <div className={s.attendanceContainer}>
        {hostInfo}
        {attendingInfo}
        <AttendeesDropdown attendees={Attendees} />
      </div>
    );
  };

  const renderCancelledStatus = () => {
    if (!activity.IsCancelled) {
      return null;
    }

    return (
      <div className={s.cancelledActivityCard}>
        <div className={s.cancelledActivityCardText}>
          <FontAwesomeIcon icon={faBan} />
          <span>Activity cancelled!</span>
        </div>
      </div>
    );
  };

  const editBtn = isHost ? (
    <Button
      theme="action"
      icon={faPenNib}
      className={s.controlBtn}
      onClick={() => props.onEdit(activity)}
    />
  ) : null;

  const deleteBtn = isHost ? (
    <Button
      theme="action"
      icon={faTrash}
      className={s.controlBtn}
      onClick={() => props.onDelete(activity)}
    />
  ) : null;

  const category = activity.Category ? (<div className={s.activityCategory}>{activity.Category}</div>) : null;
  return (
    <div key={activity.Id} className={s.activityCard}>
      {renderCancelledStatus()}
      <div className={s.activityHeader}>
        <h3 onClick={() => history.push(`/activity/${activity.Id}`)}>{activity.Title}</h3>
        <div className={s.controlBtns}>
          <Button
            theme="action"
            icon={faEye}
            className={s.controlBtn}
            onClick={() => history.push(`/activity/${activity.Id}`)}
          />
          {editBtn}
          {deleteBtn}
        </div>
      </div>
      <div className={s.activityLocation}>
        {activity.City}, {activity.Venue}
      </div>
      {renderAttendance()}
      <div className={s.activitiesFooter}>
        <div>
          <div className={s.activityDate}>By {activity.AuthorName}</div>
          <Tooltip
            title={date.format('DD MMMM YYYY, HH:mm')}
            position="top"
            trigger="mouseenter"
          >
            <div className={s.activityDate}>{date.fromNow()}</div>
          </Tooltip>
        </div>
        {category}
      </div>
    </div>
  );
};

export default ActivityCard;
