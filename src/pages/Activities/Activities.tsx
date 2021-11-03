import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { activateActivity, cancelActivity, fetchActivities, followActivity, unfollowActivity } from 'api/activities';
import { ActivityFiltersPayload, ActivityItem } from 'types/activity';
import _ from 'lodash';

import s from './Activities.css';
import AddEditActivityModal from 'pages/Activities/AddEditActivityModal';
import { faSortAmountUpAlt, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRecoilState, useRecoilValue } from 'recoil';
import activitiesFormState from 'recoil/activitiesFormState';
import Loader from 'ui/Loader/Loader';
import { useModal } from 'recoil/modalsState';

import ActivityFilters from 'pages/Activities/ActivityFilters';
import Checkbox from 'ui/Checkbox/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlert } from 'recoil/alertState';

import { currentUserState } from 'recoil/user';
import ActivityCard from 'pages/Activities/ActivityCard';
import handleApiSuccess from 'api/handleApiSuccess';
import handleApiErrors from 'api/handleApiErrors';
import useQueryUpdate from 'api/useQueryUpdate';
import history from 'utils/history';
import TabTitle from 'ui/TabTitle/TabTitle';

dayjs.extend(relativeTime);

const Activities: React.FC = () => {
  const updateQuery = useQueryUpdate();
  const currentUser = useRecoilValue(currentUserState);
  const { spawnAlert } = useAlert();

  const [filters, setFilters] = useState<ActivityFiltersPayload>({
    DateSort: 'Desc',
  });

  const [groupByDate, setGroupByDate] = useState(false);

  const { data: activities, isLoading, refetch: loadActivities } = useQuery<ActivityItem[]>(
    [fetchActivities.name, filters], () => fetchActivities.request(filters));

  const [modalActivity, setModalActivity] = useState<ActivityItem | null>(null);
  const [formType, setFormType] = useRecoilState(activitiesFormState);
  const { showModal } = useModal('addEditActivity');

  const updateActivities = (data: ActivityItem) => {
    updateQuery([fetchActivities.name, filters],
      (oldData: ActivityItem[]) => _.map(oldData, d => d.Id === data.Id ? data : d),
    );
  };

  const activateMutation = useMutation(activateActivity.name, activateActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity activated!', spawnAlert);
    },
    onError: (error: any) => {
      handleApiErrors(error.Message, 'Cannot activate the activity', spawnAlert);
    },
  });

  const cancelMutation = useMutation(cancelActivity.name, cancelActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity canceled!', spawnAlert);
    },
    onError: (error: any) => {
      handleApiErrors(error.Message, 'Cannot cancel the activity', spawnAlert);
    },
  });

  const followMutation = useMutation(followActivity.name, followActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity followed!', spawnAlert);
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Cannot follow activity', spawnAlert);
    },
  });

  const unfollowMutation = useMutation(unfollowActivity.name, unfollowActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity unfollowed!', spawnAlert);
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Cannot unfollow activity', spawnAlert);
    },
  });

  const groupedActivities = useMemo(() => {
    return _.groupBy(activities, a => dayjs(a.Date).format('YYYY-MM-DD'));
  }, [activities]);

  useEffect(() => {
    if (formType === 'add' && modalActivity !== null) {
      setModalActivity(null);
    }
  }, [formType]);

  useEffect(() => {
    if (modalActivity) {
      const newActivity = _.find(activities, a => a.Id === modalActivity.Id);
      setModalActivity(newActivity ?? null);
    }
  }, [activities]);

  const handleCancelActivate = (activity: ActivityItem) => {
    if (activity.IsCancelled) {
      activateMutation.mutate(activity.Id);
      return;
    }

    cancelMutation.mutate(activity.Id);
  };

  const handleFollowUnfollow = (activity: ActivityItem, following: boolean) => {
    if (following) {
      unfollowMutation.mutate(activity.Id);
      return;
    }

    followMutation.mutate(activity.Id);
  };

  const handleEditActivity = (activity: ActivityItem) => {
    showModal();
    setFormType('edit');
    setModalActivity(activity);
  };

  const handleClear = () => {
    history.replace({
      search: '',
    });

    setFilters({ DateSort: filters.DateSort });
  };

  const renderActivityCard = (activity: ActivityItem) => {
    const isLoading = cancelMutation.isLoading || activateMutation.isLoading
      || followMutation.isLoading || unfollowMutation.isLoading;
    return (
      <ActivityCard
        key={activity.Id}
        activity={activity}
        currentUserId={currentUser.Id}
        onEdit={handleEditActivity}
        onCancelActivate={handleCancelActivate}
        onFollowUnfollow={handleFollowUnfollow}
        isLoading={isLoading}
      />
    );
  };

  const renderActivities = () => {
    if (isLoading) {
      return (
        <div className={s.activityCards}>
          <Loader />
        </div>
      );
    }

    const list = groupByDate ? _.map(groupedActivities, (items, date) => {
      return (
        <div key={date} className={`${s.activityCards} ${s.groupedItem}`}>
          <div className={s.groupDate}>{dayjs(date).format('DD MMMM YYYY')}</div>
          {_.map(items, renderActivityCard)}
        </div>
      );
    }) : _.map(activities, renderActivityCard);

    return (
      <div className={s.activityCards}>
        {_.isEmpty(list) ? 'Activities not found' : list}
      </div>
    );
  };

  const handleSort = () => {
    setFilters({
      ...filters,
      DateSort: filters.DateSort === 'Asc' ? 'Desc' : 'Asc',
    });
  };

  const renderSortGroup = () => {
    const sortValue = filters.DateSort === 'Asc' ? 'Oldest to newest' : 'Newest to oldest';

    const sortIcon = filters.DateSort === 'Asc' ? faSortAmountDown : faSortAmountUpAlt;

    return (
      <div className={s.sortGroupContainer}>
        <div
          className={s.sortLabel}
          onClick={handleSort}
        >
          <div>Sort by date: {sortValue}</div>
          <FontAwesomeIcon className={s.sortIcon} icon={sortIcon} />
        </div>
        <Checkbox
          label="Group by date"
          isChecked={groupByDate}
          className={s.filterCheckbox}
          onChange={() => setGroupByDate(!groupByDate)}
        />
        <Checkbox
          label="My activities"
          isChecked={Boolean(filters.IsMy)}
          className={s.filterCheckbox}
          onChange={() => setFilters({ ...filters, IsMy: !filters.IsMy })}
        />
        <Checkbox
          label="I'm attending"
          className={s.filterCheckbox}
          isChecked={Boolean(filters.Attending)}
          onChange={() => setFilters({ ...filters, Attending: !filters.Attending })}
        />
        <Checkbox
          label="I'm following"
          isChecked={Boolean(filters.Following)}
          className={s.filterCheckbox}
          onChange={() => setFilters({ ...filters, Following: !filters.Following })}
        />
      </div>
    );
  };

  return (
    <div className={s.activitiesPage}>
      <TabTitle title="Activities" />
      {renderSortGroup()}
      <div className={s.activitiesContainer}>
        {renderActivities()}
        <ActivityFilters
          filters={filters}
          onChange={setFilters}
          onClear={handleClear}
        />
      </div>
      <AddEditActivityModal
        activity={modalActivity}
        updateListData={() => loadActivities()}
      />
    </div>
  );
};

export default Activities;
