import React, { useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { ActivityItem } from 'types/activity';
import {
  attendActivity,
  deleteActivity,
  fetchActivity,
  leaveActivity,
  activateActivity,
  cancelActivity, followActivity, unfollowActivity,
} from 'api/activities';
import Loader from 'ui/Loader/Loader';

import dayjs from 'dayjs';

import s from './Activity.css';
import Breadcrumbs from 'ui/Breadcrumbs/Breadcrumbs';
import Button from 'ui/Button/Button';
import AddEditActivityModal from 'pages/Activities/AddEditActivityModal';
import { faMapMarkerAlt, faCalendar, faTag, faUserAlt, faBan } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlert } from 'recoil/alertState';
import history from 'utils/history';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'recoil/user';
import _ from 'lodash';
import handleApiErrors from 'api/handleApiErrors';
import handleApiSuccess from 'api/handleApiSuccess';
import UserProfileModal from 'ui/UserProfileCard/UserProfileModal';
import ConfirmationModal from 'ui/ConfirmationModal/ConfirmationModal';
import ActivityChat from 'pages/Activity/chat/ActivityChat';
import NotFound from 'ui/NotFound/NotFound';
import TabTitle from 'ui/TabTitle/TabTitle';
import useModal from 'hooks/useModal';
import { ApiError } from 'types/entities';

const Activity: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  const { id } = props.match.params;
  const currentUser = useRecoilValue(currentUserState);

  const { spawnAlert } = useAlert();

  const { showModal } = useModal('addEditActivity');
  const { showModal: showUserProfileModal } = useModal('');
  const { showModal: showDeleteConfirmation } = useModal('deleteActivityConfirmation');

  const [currentAttendeeId, setCurrentAttendeeId] = useState('');

  const {
    data: activity,
    isLoading,
    refetch: loadActivity,
  } = useQuery<ActivityItem>([fetchActivity.name, id], () => fetchActivity.request(id));

  const deleteMutation = useMutation(deleteActivity.name, deleteActivity.request, {
    onSuccess: () => {
      handleApiSuccess('Activity deleted!', spawnAlert);
      history.push('/');
    },
    onError: (error: ApiError) => {
      handleApiErrors(error, 'Failed to delete activity', spawnAlert);
    },
  });

  const attendMutation = useMutation(attendActivity.name, attendActivity.request, {
    onSuccess: () => {
      handleApiSuccess('Attending this activity!', spawnAlert);
      loadActivity();
    },
    onError: (error: ApiError) => {
      handleApiErrors(error, 'Cannot attend the activity', spawnAlert);
    },
  });

  const leaveMutation = useMutation(leaveActivity.name, leaveActivity.request, {
    onSuccess: () => {
      handleApiSuccess('Left this activity!', spawnAlert);
      loadActivity();
    },
    onError: (error: ApiError) => {
      handleApiErrors(error, 'Cannot leave the activity', spawnAlert);
    },
  });

  const activateMutation = useMutation(activateActivity.name, activateActivity.request, {
    onSuccess: () => {
      handleApiSuccess('Activity activated!', spawnAlert);
      loadActivity();
    },
    onError: (error: ApiError) => {
      handleApiErrors(error, 'Cannot activate the activity', spawnAlert);
    },
  });

  const cancelMutation = useMutation(cancelActivity.name, cancelActivity.request, {
    onSuccess: () => {
      handleApiSuccess('Activity canceled!', spawnAlert);
      loadActivity();
    },
    onError: (error: ApiError) => {
      handleApiErrors(error, 'Cannot cancel the activity', spawnAlert);
    },
  });

  const followMutation = useMutation(followActivity.name, followActivity.request, {
    onSuccess: () => {
      loadActivity();
      handleApiSuccess('Activity followed!', spawnAlert);
    },
    onError: (err: ApiError) => {
      handleApiErrors(err, 'Cannot follow activity', spawnAlert);
    },
  });

  const unfollowMutation = useMutation(unfollowActivity.name, unfollowActivity.request, {
    onSuccess: () => {
      loadActivity();
      handleApiSuccess('Activity unfollowed!', spawnAlert);
    },
    onError: (err: ApiError) => {
      handleApiErrors(err, 'Cannot unfollow activity', spawnAlert);
    },
  });

  const isHost = useMemo(() => {
    if (!activity || !currentUser) {
      return false;
    }

    return activity.AuthorId === currentUser.Id;
  }, [activity, currentUser]);

  const handleDeleteConfirmation = () => {
    showDeleteConfirmation();
  };

  const handleDeleteActivity = () => {
    deleteMutation.mutate(id);
  };

  const handleAttendeeClick = (id: string) => {
    if (id === currentUser!.Id) {
      history.push('/profile');
      return;
    }

    setCurrentAttendeeId(id);
    showUserProfileModal(`userProfile-${id}`);
  };

  const handleFollowUnfollow = (following: boolean) => {
    if (!activity) {
      return;
    }

    if (following) {
      unfollowMutation.mutate(activity.Id);
      return;
    }

    followMutation.mutate(activity.Id);
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const renderField = (title: string, value: string, icon: IconDefinition) => {
    if (!value) {
      return null;
    }

    return (
      <div className={s.activityPageField}>
        <div className={s.activityPageFieldTitle}>{title}</div>
        <div className={s.activityPageFieldValue}>
          <FontAwesomeIcon icon={icon} className={s.activityPageFieldIcon} />
          <div>{value}</div>
        </div>
      </div>
    );
  };

  if (!activity) {
    return (
      <NotFound
        entityName="Activity"
        link="/"
        linkText="the list of activities"
      />
    );
  }

  const renderAttendButton = () => {
    if (isHost) {
      return null;
    }

    const alreadyAttending = _.find(activity.Attendees, a => a.UserId === currentUser!.Id);

    if (alreadyAttending) {
      return (
        <Button
          theme="danger"
          text="Leave activity"
          className={s.controlButton}
          onClick={() => leaveMutation.mutate(activity.Id)}
        />
      );
    }

    if (activity.IsCancelled) {
      return null;
    }

    return (
      <Button
        theme="primary"
        text="Attend activity"
        className={s.controlButton}
        onClick={() => attendMutation.mutate(activity.Id)}
      />
    );
  };

  const renderFollowUnfollowBtn = () => {
    if (isHost) {
      return null;
    }

    const follower = _.find(activity.Followers, f => f.UserId === currentUser!.Id);
    const following = !_.isEmpty(follower);

    return (
      <Button
        theme="primary"
        text={following ? 'Unfollow' : 'Follow'}
        className={s.controlButton}
        onClick={() => handleFollowUnfollow(following)}
        isLoading={followMutation.isLoading || unfollowMutation.isLoading}
      />
    );
  };

  const renderActionBtns = () => {
    if (!isHost) {
      return null;
    }

    const cancelActivateBtn = activity.IsCancelled ? (
      <Button
        theme="primary"
        text="Activate activity"
        className={s.controlButton}
        onClick={() => activateMutation.mutate(activity.Id)}
        disabled={deleteMutation.isLoading}
      />
    ) : (
      <Button
        theme="danger"
        text="Cancel activity"
        className={s.controlButton}
        onClick={() => cancelMutation.mutate(activity.Id)}
        disabled={deleteMutation.isLoading}
      />
    );

    return (
      <React.Fragment>
        <Button
          theme="action"
          text="Edit"
          className={s.controlButton}
          onClick={() => showModal()}
          disabled={deleteMutation.isLoading}
        />
        {cancelActivateBtn}
        <Button
          theme="danger"
          text="Delete"
          className={s.controlButton}
          onClick={handleDeleteConfirmation}
          disabled={deleteMutation.isLoading}
        />
      </React.Fragment>
    );
  };

  const renderAttendees = () => {
    const list = _.map(activity.Attendees, (attendee) => {
      const name = attendee.UserId === currentUser!.Id ? 'You' : attendee.Name;
      const following = _.find(activity.Followers, f => f.UserId === attendee.UserId);
      return (
        <div key={attendee.UserId} className={s.attendee} onClick={() => handleAttendeeClick(attendee.UserId)}>
          <FontAwesomeIcon icon={faUserAlt} className={s.userIcon} />
          <span>{name}</span>
          {following ? (<span className={s.following}>following</span>) : null}
        </div>
      );
    });

    return (
      <React.Fragment>
        <h2 className={s.attendeesTitle}>Attendees</h2>
        <div className={s.activityPageHeader}>
          {_.isEmpty(list) ? 'No one is going yet :(' : list}
        </div>
        <UserProfileModal userId={currentAttendeeId} />
      </React.Fragment>
    );
  };

  const renderCancelStatus = () => {
    if (!activity.IsCancelled) {
      return null;
    }

    return (
      <div className={s.cancelledActivity}>
        <FontAwesomeIcon icon={faBan} />
        <span>Activity is cancelled</span>
      </div>
    );
  };

  const handleHostClick = () => {
    if (isHost) {
      history.push('/profile');
      return;
    }

    showUserProfileModal(`userProfile-${activity.AuthorId}`);
  };

  return (
    <div className={s.activityPage}>
      <TabTitle title={`Activity - ${activity.Title}`} />
      <div className={s.content}>
        <Breadcrumbs tabs={[{ title: 'All activities', path: '/' }, { title: activity.Title }]} />
        <div className={s.activityPageTop}>
          <div className={s.activityPageLeft}>
            <div className={s.activityPageHeader}>
              {renderCancelStatus()}
              <h2 className={s.activityPageTitle}>{activity.Title}</h2>
              <h4 onClick={handleHostClick}>Hosted by {isHost ? 'you' : activity.AuthorName}</h4>
              <div className={s.activityControlButtons}>
                {renderFollowUnfollowBtn()}
                {renderAttendButton()}
                {renderActionBtns()}
              </div>
            </div>
            <div className={s.activityPageInfo}>
              <div className={s.activityPageSubTitle}>Info</div>
              <div className={s.activityPageFields}>
                {renderField('Location', `${activity.City}, ${activity.Venue}`, faMapMarkerAlt)}
                {renderField('Date', dayjs(activity.Date).format('DD MMMM YYYY, HH:mm'), faCalendar)}
                {renderField('Category', activity.Category, faTag)}
              </div>
              <div className={s.activityPageFieldTitle}>Description</div>
              <p className={s.activityPageDesc}>{activity.Description}</p>
            </div>
          </div>
          <div className={s.activityPageSidebar}>
            {renderAttendees()}
          </div>
        </div>
        <div className={s.activityPageInfo}>
          <div className={s.activityPageSubTitle}>Chat</div>
          <ActivityChat activityId={activity.Id} activityComments={activity.Comments} />
        </div>
      </div>
      <AddEditActivityModal activity={activity} />
      <ConfirmationModal
        modalKey="deleteActivityConfirmation"
        title="Delete activity"
        text="Are you sure you want to delete the activity? This action is irreversible"
        status={deleteMutation.status}
        action={handleDeleteActivity}
      />
      <UserProfileModal userId={activity.AuthorId} />
    </div>
  );
};

export default Activity;
