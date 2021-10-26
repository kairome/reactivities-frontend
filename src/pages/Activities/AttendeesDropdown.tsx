import React from 'react';
import { ActivityAttendee } from 'types/activity';
import _ from 'lodash';
import { faAddressCard, faUserAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import s from './Activities.css';
import Dropdown from 'ui/Dropdown/Dropdown';

interface Props {
  attendees: ActivityAttendee[],
}

const AttendeesDropdown: React.FC<Props> = (props) => {
  const { attendees } = props;

  const renderList = () => {
    return _.map(attendees, attendee => (
      <div key={attendee.UserId} className={s.attendeeItem}>
        <FontAwesomeIcon className={s.attendeeItemIcon} icon={faUserAlt} />
        <div>{attendee.Name}</div>
      </div>
    ));
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
    <Dropdown
      renderDropdownControl={renderAttendance}
      list={renderList()}
    />
  );
};

export default AttendeesDropdown;
