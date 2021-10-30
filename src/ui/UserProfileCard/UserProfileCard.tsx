import React from 'react';
import { UserProfileItem } from 'types/user';

import s from './UserProfileCard.css';

interface Props {
  profile: UserProfileItem,
}

const UserProfileCard: React.FC<Props> = (props) => {
  const { profile } = props;

  if (!profile) {
    return (
      <div>
        Profile not found
      </div>
    );
  }

  return (
    <div className={s.profileCard}>
      <div className={s.profileHeader}>
        <img
          src={profile.PhotoUrl}
          className={s.profilePhoto}
          alt={`${profile.Name} profile photo`}
        />
        <div>
          <div className={s.profileName}>{profile.Name}</div>
          <p>{profile.Bio}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
