import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteActivity, fetchActivities } from 'api/activities';
import { ActivityFiltersPayload, ActivityItem } from 'types/activity';
import _ from 'lodash';

import s from './Activities.css';
import Button from 'ui/Button/Button';
import AddEditActivityModal from 'pages/Activities/AddEditActivityModal';
import { faPenNib, faTrash, faEye, faSortAmountUpAlt, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRecoilState } from 'recoil';
import activitiesFormState from 'recoil/activitiesFormState';
import Loader from 'ui/Loader/Loader';
import { useModal } from 'recoil/modalsState';
import { Tooltip } from 'react-tippy';

import ActivityFilters from 'pages/Activities/ActivityFilters';
// import { useHistory } from 'react-router-dom';
import Checkbox from 'ui/Checkbox/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlert } from 'recoil/alertState';

import history from 'utils/history';

dayjs.extend(relativeTime);

const Activities: React.FC = () => {
  const queryClient = useQueryClient();
  // const history = useHistory();
  const { spawnAlert } = useAlert();

  const [filters, setFilters] = useState<ActivityFiltersPayload>({
    DateSort: 'Desc',
  });

  const [groupByDate, setGroupByDate] = useState(false);

  const { data: activities, isLoading, refetch: loadActivities } = useQuery<ActivityItem[]>(
    [fetchActivities.name, filters], () => fetchActivities.request(filters));

  const [modalActivity, setModalActivity] = useState<ActivityItem | null>(null);
  const [formType, setFormType] = useRecoilState(activitiesFormState);
  const { isModalOpen, showModal } = useModal('addEditActivity');

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
    const category = activity.Category ? (<div className={s.activityCategory}>{activity.Category}</div>) : null;

    const date = dayjs(activity.Date);

    return (
      <div key={activity.Id} className={s.activityCard}>
        <div className={s.activityHeader}>
          <h3>{activity.Title}</h3>
          <div className={s.controlBtns}>
            <Button
              theme="action"
              icon={faEye}
              className={s.controlBtn}
              onClick={() => history.push(`/activity/${activity.Id}`)}
              disabled={isModalOpen}
            />
            <Button
              theme="action"
              icon={faPenNib}
              className={s.controlBtn}
              onClick={() => handleEditActivity(activity)}
            />
            <Button
              theme="action"
              icon={faTrash}
              className={s.controlBtn}
              onClick={() => handleDeleteActivity(activity)}
            />
          </div>
        </div>
        <div className={s.activityLocation}>
          {activity.City}, {activity.Venue}
        </div>
        <div className={s.activitiesFooter}>
          <Tooltip
            title={date.format('DD MMMM YYYY, HH:mm')}
            position="top"
            trigger="mouseenter"
          >
            <div className={s.activityDate}>{date.fromNow()}</div>
          </Tooltip>
          {category}
        </div>
      </div>
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
          onChange={() => setGroupByDate(!groupByDate)}
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
