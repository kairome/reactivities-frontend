import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { ActivityItem } from 'types/activity';
import { deleteActivity, fetchActivity } from 'api/activities';
import Loader from 'ui/Loader/Loader';

import dayjs from 'dayjs';

import s from './Activity.css';
import Breadcrumbs from 'ui/Breadcrumbs/Breadcrumbs';
import Button from 'ui/Button/Button';
import AddEditActivityModal from 'pages/Activities/AddEditActivityModal';
import { useModal } from 'recoil/modalsState';
import { faMapMarkerAlt, faCalendar, faTag } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAlert } from 'recoil/alertState';
import history from 'utils/history';

const Activity: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  const { id } = props.match.params;
  // const history = useHistory();
  const { spawnAlert } = useAlert();

  const { showModal } = useModal('addEditActivity');

  const deleteMutation = useMutation(deleteActivity.name, deleteActivity.request, {
    onSuccess: () => {
      spawnAlert({
        type: 'success',
        title: 'Activity deleted!',
      });
      history.push('/');
    },
  });

  const {
    data: activity,
    isLoading,
  } = useQuery<ActivityItem>(fetchActivity.name, () => fetchActivity.request(id));

  const handleDeleteActivity = () => {
    deleteMutation.mutate(id);
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
      <div>
        Activity not found
      </div>
    );
  }

  return (
    <div className={s.activityPage}>
      <Breadcrumbs tabs={[{ title: 'All activities', path: '/' }, { title: activity.Title }]} />
      <div className={s.activityPageTop}>
        <div className={s.activityPageLeft}>
          <div className={s.activityPageHeader}>
            <h2 className={s.activityPageTitle}>{activity.Title}</h2>
            <div className={s.activityControlButtons}>
              <Button
                theme="action"
                text="Edit"
                className={s.controlButton}
                onClick={() => showModal()}
                disabled={deleteMutation.isLoading}
              />
              <Button
                theme="danger"
                text="Delete"
                className={s.controlButton}
                onClick={handleDeleteActivity}
                disabled={deleteMutation.isLoading}
              />
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
          Sidebar
        </div>
      </div>
      <div className={s.activityPageInfo}>
        <div className={s.activityPageSubTitle}>Chat</div>
      </div>
      <AddEditActivityModal activity={activity} />
    </div>
  );
};

export default Activity;
