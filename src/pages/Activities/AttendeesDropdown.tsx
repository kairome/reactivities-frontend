import React, { useState } from 'react';
import { ActivityAttendee } from 'types/activity';
import _ from 'lodash';
import { faAddressCard, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import s from './Activities.css';
import Dropdown from 'ui/Dropdown/Dropdown';
import UserProfileModal from 'ui/UserProfileCard/UserProfileModal';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'recoil/user';
import history from 'utils/history';
import useModal from 'hooks/useModal';

interface Props {
  attendees: ActivityAttendee[],
}

const AttendeesDropdown: React.FC<Props> = (props) => {
  const { attendees } = props;
  const currentUser = useRecoilValue(currentUserState);
  const [currentUserId, setCurrentUserId] = useState('');
  const { showModal } = useModal('');

  const handleAttendeeClick = (id: string) => {
    if (currentUser.Id === id) {
      history.push('/profile');
      return;
    }

    showModal(`userProfile-${id}`);
    setCurrentUserId(id);
  };

  const renderList = () => {
    return _.map(attendees, (attendee) => {
      const youText = attendee.UserId === currentUser.Id ? ' (you)' : null;

      return (
        <div key={attendee.UserId} className={s.attendeeItem} onClick={() => handleAttendeeClick(attendee.UserId)}>
          <FontAwesomeIcon className={s.attendeeItemIcon} icon={faUserAlt} />
          <div className={s.attendeeName}>{attendee.Name}{youText}</div>
        </div>
      );
    });
  };


  const renderAttendance = () => {
    return (
      <div className={s.attendeeInfo}>
        <FontAwesomeIcon className={s.attendeeIcon} icon={faAddressCard} />
        <span>{attendees.length} {attendees.length === 1 ? 'is' : 'are'} going</span>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Dropdown
        renderDropdownControl={renderAttendance}
        list={renderList()}
      />
      <UserProfileModal userId={currentUserId} />
    </React.Fragment>
  );
};

export default AttendeesDropdown;
