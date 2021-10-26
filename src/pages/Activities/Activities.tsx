import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteActivity, fetchActivities } from 'api/activities';
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

import ActivityFilters from 'pages/Activities/ActivityFilters';;
import Checkbox from 'ui/Checkbox/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlert } from 'recoil/alertState';

import { currentUserState } from 'recoil/user';
import ActivityCard from 'pages/Activities/ActivityCard';

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

  const deleteMutation = useMutation(deleteActivity.name, deleteActivity.request, {
    onSuccess: (data: undefined, activityId) => {
      queryClient.setQueryData<ActivityItem[]>(
        [fetchActivities.name, filters], (oldData) => _.filter(oldData, d => d.Id !== activityId));
      spawnAlert({
        type: 'success',
        title: 'Activity deleted!',
      });
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

  const handleDeleteActivity = (activity: ActivityItem) => {
    setModalActivity(activity);
    deleteMutation.mutate(activity.Id);
  };

  const handleEditActivity = (activity: ActivityItem) => {
    showModal();
    setFormType('edit');
    setModalActivity(activity);
  };

  const renderActivityCard = (activity: ActivityItem) => {
    return (
      <ActivityCard
        activity={activity}
        currentUserId={currentUser.Id}
        onEdit={handleEditActivity}
        onDelete={handleDeleteActivity}
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
          onChange={() => setFilters({ ...filters, IsMy: !filters.IsMy })}
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
