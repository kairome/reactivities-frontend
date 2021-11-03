import React from 'react';
import { UserActivitiesStats, UserProfileItem } from 'types/user';

import s from './UserProfileCard.css';

interface Props {
  profile: UserProfileItem,
  stats: UserActivitiesStats | null,
}

const UserProfileCard: React.FC<Props> = (props) => {
  const { profile, stats } = props;

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
          src={profile.PhotoUrl ?? '/assets/default.jpeg'}
          className={s.profilePhoto}
          alt={`${profile.Name} profile photo`}
        />
        <div>
          <div className={s.profileName}>{profile.Name}</div>
          <p>{profile.Bio}</p>
          <div className={s.userStat}>Activities hosted: {stats?.ActivitiesHosting ?? 0}</div>
          <div className={s.userStat}>Activities attending: {stats?.ActivitiesAttending ?? 0}</div>
          <div className={s.userStat}>Activities followed: {stats?.ActivitiesFollowing ?? 0}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
