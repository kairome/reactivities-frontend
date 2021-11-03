import React from 'react';
import { ActivityItem } from 'types/activity';
import _ from 'lodash';
import s from 'pages/Activities/Activities.css';
import dayjs from 'dayjs';
import Button from 'ui/Button/Button';
import {
  faEye,
  faPenNib,
  faHouseUser,
  faBriefcase,
  faBan,
  faCheckCircle,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AttendeesDropdown from 'pages/Activities/AttendeesDropdown';
import { Link } from 'react-router-dom';

interface Props {
  activity: ActivityItem,
  currentUserId: string,
  onFollowUnfollow: (a: ActivityItem, following: boolean) => void,
  onEdit: (a: ActivityItem) => void,
  onCancelActivate: (a: ActivityItem) => void,
  isLoading: boolean,
}

const ActivityCard: React.FC<Props> = (props) => {
  const { activity, currentUserId, isLoading } = props;

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

  const renderControlBtns = () => {
    if (!isHost) {
      return null;
    }

    return (
      <React.Fragment>
        <Button
          theme="action"
          icon={faPenNib}
          className={s.controlBtn}
          title="Edit"
          onClick={() => props.onEdit(activity)}
        />
        <Button
          theme="action"
          icon={activity.IsCancelled ? faCheckCircle : faBan}
          className={s.controlBtn}
          title={activity.IsCancelled ? 'Activate' : 'Cancel'}
          onClick={() => props.onCancelActivate(activity)}
          disabled={isLoading}
        />
      </React.Fragment>
    );
  };

  const renderFollowUnfollow = () => {
    if (isHost) {
      return null;
    }

    const follower = _.find(activity.Followers, f => f.UserId === currentUserId);
    const following = !_.isEmpty(follower);

    return (
      <Button
        theme="action"
        icon={following ? faEyeSlash : faEye}
        title={following ? 'Unfollow' : 'Follow'}
        className={s.controlBtn}
        onClick={() => props.onFollowUnfollow(activity, following)}
        disabled={isLoading}
      />
    );
  };

  const category = activity.Category ? (<div className={s.activityCategory}>{activity.Category}</div>) : null;
  return (
    <div key={activity.Id} className={s.activityCard}>
      {renderCancelledStatus()}
      <div className={s.activityHeader}>
        <Link to={`/activity/${activity.Id}`} className={s.activityCardTitle}>{activity.Title}</Link>
        <div className={s.controlBtns}>
          {renderFollowUnfollow()}
          {renderControlBtns()}
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
            position="top-start"
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
