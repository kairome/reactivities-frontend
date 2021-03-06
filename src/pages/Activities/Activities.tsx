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

import ActivityFilters from 'pages/Activities/ActivityFilters';
import Checkbox from 'ui/Checkbox/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlert } from 'recoil/alertState';

import { currentUserState } from 'recoil/user';
import ActivityCard from 'pages/Activities/ActivityCard';
import handleApiSuccess from 'api/handleApiSuccess';
import handleApiErrors from 'api/handleApiErrors';
import history from 'utils/history';
import TabTitle from 'ui/TabTitle/TabTitle';
import { ApiError, PaginatedList } from 'types/entities';
import InfiniteScroll from 'react-infinite-scroll-component';
import useModal from 'hooks/useModal';
import ScrollTopButton from 'ui/ScrollTopButton/ScrollTopButton';

dayjs.extend(relativeTime);

const defaultFilters = {
  DateSort: 'Desc' as 'Desc',
  PageSize: 5,
  CurrentPage: 1,
};

const Activities: React.FC = () => {
  const currentUser = useRecoilValue(currentUserState);
  const { spawnAlert } = useAlert();

  const [filters, setFilters] = useState<ActivityFiltersPayload>(defaultFilters);

  const [groupByDate, setGroupByDate] = useState(false);

  const { data: requestActivities, isLoading } = useQuery<PaginatedList<ActivityItem>>(
    [fetchActivities.name, filters], () => fetchActivities.request(filters), {
      cacheTime: 0,
    });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [fetchingNextPage, setFetchingNextPage] = useState(false);

  const hasMorePages = useMemo(() => {
    if (!requestActivities) {
      return false;
    }

    return requestActivities.CurrentPage < requestActivities.TotalPages;
  }, [requestActivities]);

  const [modalActivity, setModalActivity] = useState<ActivityItem | null>(null);
  const [formType, setFormType] = useRecoilState(activitiesFormState);
  const { showModal } = useModal('addEditActivity');

  const updateActivities = (newAct: ActivityItem) => {
    setActivities((oldActivities) => _.map(oldActivities, (act) => act.Id === newAct.Id ? newAct : act));
  };

  const activateMutation = useMutation(activateActivity.name, activateActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity activated!', spawnAlert);
    },
    onError: (error: ApiError) => {
      handleApiErrors(error, 'Cannot activate the activity', spawnAlert);
    },
  });

  const cancelMutation = useMutation(cancelActivity.name, cancelActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity canceled!', spawnAlert);
    },
    onError: (error: ApiError) => {
      handleApiErrors(error, 'Cannot cancel the activity', spawnAlert);
    },
  });

  const followMutation = useMutation(followActivity.name, followActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity followed!', spawnAlert);
    },
    onError: (err: ApiError) => {
      handleApiErrors(err, 'Cannot follow activity', spawnAlert);
    },
  });

  const unfollowMutation = useMutation(unfollowActivity.name, unfollowActivity.request, {
    onSuccess: (data) => {
      updateActivities(data);
      handleApiSuccess('Activity unfollowed!', spawnAlert);
    },
    onError: (err: ApiError) => {
      handleApiErrors(err, 'Cannot unfollow activity', spawnAlert);
    },
  });

  const groupedActivities = useMemo(() => {
    return _.groupBy(activities, a => dayjs(a.Date).format('YYYY-MM-DD'));
  }, [activities]);

  useEffect(() => {
  }, []);

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

  useEffect(() => {
    if (requestActivities?.Items) {
      if (fetchingNextPage) {
        setActivities([...activities, ...requestActivities.Items]);
        setFetchingNextPage(false);
        return;
      }

      setActivities(requestActivities.Items);
    }
  }, [requestActivities]);

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

    setFilters({ ...defaultFilters, DateSort: filters.DateSort });
  };

  const handleFiltersChange = (newFilters: ActivityFiltersPayload) => {
    setFilters({
      ...newFilters,
      CurrentPage: 1,
    });
  };

  const renderActivityCard = (activity: ActivityItem) => {
    const isLoading = cancelMutation.isLoading || activateMutation.isLoading
      || followMutation.isLoading || unfollowMutation.isLoading;
    return (
      <ActivityCard
        key={activity.Id}
        activity={activity}
        currentUserId={currentUser!.Id}
        onEdit={handleEditActivity}
        onCancelActivate={handleCancelActivate}
        onFollowUnfollow={handleFollowUnfollow}
        isLoading={isLoading}
      />
    );
  };

  const renderActivities = () => {
    if (isLoading && !fetchingNextPage) {
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

    const endMessage = _.isEmpty(list) ? 'No activities found' : 'You\'re all up to date!';

    return (
      <div className={s.activityCards}>
        {renderSortGroup()}
        <InfiniteScroll
          style={{ width: '100%', overflow: 'initial' }}
          dataLength={activities.length}
          next={handleMore}
          hasMore={hasMorePages}
          loader={<div className={s.scrollContent}><Loader /></div>}
          scrollableTarget="page"
          endMessage={<div className={s.scrollContent}>{fetchingNextPage ? (<Loader />) : endMessage}</div>}
        >
          {list}
        </InfiniteScroll>
      </div>
    );
  };

  const handleSort = () => {
    setFilters({
      ...filters,
      DateSort: filters.DateSort === 'Asc' ? 'Desc' : 'Asc',
      CurrentPage: 1,
    });
  };

  const handleMore = () => {
    if (fetchingNextPage) {
      return;
    }
    setFetchingNextPage(true);
    setFilters({
      ...filters,
      CurrentPage: filters.CurrentPage + 1,
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
      </div>
    );
  };

  return (
    <div className={s.activitiesPage}>
      <TabTitle title="Activities" />
      <div className={s.activitiesContainer}>
        {renderActivities()}
        <ActivityFilters
          filters={filters}
          onChange={handleFiltersChange}
          onClear={handleClear}
        />
      </div>
      <AddEditActivityModal
        activity={modalActivity}
        updateListData={updateActivities}
      />
      <ScrollTopButton />
    </div>
  );
};

export default Activities;
