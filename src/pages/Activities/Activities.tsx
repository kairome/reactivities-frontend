import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { activateActivity, cancelActivity, fetchActivities } from 'api/activities';
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

dayjs.extend(relativeTime);

const Activities: React.FC = () => {
  const queryClient = useQueryClient();
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

  const activateMutation = useMutation(activateActivity.name, activateActivity.request, {
    onSuccess: (data) => {
      queryClient.setQueryData<ActivityItem[]>(
        [fetchActivities.name, filters], (oldData) => _.map(oldData, d => d.Id === data.Id ? data : d));
      handleApiSuccess('Activity activated!', spawnAlert);
    },
    onError: (error: any) => {
      handleApiErrors(error.Message, 'Cannot activate the activity', spawnAlert);
    },
  });

  const cancelMutation = useMutation(cancelActivity.name, cancelActivity.request, {
    onSuccess: (data) => {
      queryClient.setQueryData<ActivityItem[]>(
        [fetchActivities.name, filters], (oldData) => _.map(oldData, d => d.Id === data.Id ? data : d));
      handleApiSuccess('Activity canceled!', spawnAlert);
    },
    onError: (error: any) => {
      handleApiErrors(error.Message, 'Cannot cancel the activity', spawnAlert);
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

  const handleEditActivity = (activity: ActivityItem) => {
    showModal();
    setFormType('edit');
    setModalActivity(activity);
  };

  const renderActivityCard = (activity: ActivityItem) => {
    return (
      <ActivityCard
        key={activity.Id}
        activity={activity}
        currentUserId={currentUser.Id}
        onEdit={handleEditActivity}
        isLoading={cancelMutation.isLoading || activateMutation.isLoading}
        onCancelActivate={handleCancelActivate}
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
        {list}
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
          isChecked={Boolean(filters.Attending)}
          onChange={() => setFilters({ ...filters, Attending: !filters.Attending })}
        />
      </div>
    );
  };

  return (
    <div className={s.activitiesPage}>
      {renderSortGroup()}
      <div className={s.activitiesContainer}>
        {renderActivities()}
        <ActivityFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters({ DateSort: filters.DateSort })}
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
