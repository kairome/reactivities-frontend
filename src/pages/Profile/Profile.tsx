import React, { useEffect, useState } from 'react';

import s from './Profile.css';
import _ from 'lodash';

import { faFileUpload, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import Input from 'ui/Input/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputEvent, InputEventElement, ValidationErrors } from 'types/entities';
import { useMutation, useQuery } from 'react-query';
import { updateUserProfile } from 'api/user';
import handleApiErrors from 'api/handleApiErrors';
import { useAlert } from 'recoil/alertState';
import handleApiSuccess from 'api/handleApiSuccess';
import { CurrentUser } from 'types/user';
import { fetchCurrentUser } from 'api/account';
import ProfileContent from 'pages/Profile/ProfileContent';
import UploadPhotoModal from 'pages/Profile/photos/UploadPhotoModal';
import { useModal } from 'recoil/modalsState';
import useQueryUpdate from 'api/useQueryUpdate';
import NotFound from 'ui/NotFound/NotFound';
import Loader from 'ui/Loader/Loader';
import { fetchFollowedActivitiesCount } from 'api/activities';
import { Link } from 'react-router-dom';

const defaultEditState = {
  name: false,
  email: false,
  bio: false,
};

const Profile: React.FC = () => {
  const { spawnAlert } = useAlert();
  const updateQuery = useQueryUpdate();
  const { data: currentUser, isLoading } = useQuery(fetchCurrentUser.name, fetchCurrentUser.request);

  const {
    data: activitiesFollowed,
  } = useQuery(fetchFollowedActivitiesCount.name, fetchFollowedActivitiesCount.request);

  const [editState, setEditState] = useState(defaultEditState);

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    bio: '',
  });

  const { showModal } = useModal('uploadProfilePhoto');

  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const updateMutation = useMutation(updateUserProfile.name, updateUserProfile.request, {
    onSuccess: (data: CurrentUser) => {
      handleApiSuccess('User profile updated!', spawnAlert);
      updateQuery(fetchCurrentUser.name, data);
      resetEditState();
    },
    onError: (err: any) => {
      if (err.errors) {
        setFormErrors(err.errors);
      }

      handleApiErrors(err.Message, 'Failed to update user profile', spawnAlert);
    },
  });

  useEffect(() => {
    if (currentUser) {
      setUserInfo({
        name: currentUser.DisplayName,
        email: currentUser.Email ?? '',
        bio: currentUser.Bio,
      });
    }
  }, [currentUser]);

  const resetEditState = () => {
    setEditState(defaultEditState);
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (!currentUser) {
    return (
      <NotFound
        entityName="User"
        link="/"
        linkText="the list of activities"
      />
    );
  }

  const handleEditState = (field: keyof typeof editState) => {
    setEditState({
      name: false,
      email: false,
      bio: false,
      [field]: true,
    });
  };

  const handleSubmit = () => {
    const payload = {
      Name: userInfo.name,
      Email: userInfo.email,
      Bio: userInfo.bio,
    };

    updateMutation.mutate(payload);
  };

  const handleKeyDown = (e: React.KeyboardEvent<InputEventElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  const handleUserInfoChange = (field: keyof typeof editState) => (e: InputEvent) => {
    setUserInfo({
      ...userInfo,
      [field]: e.currentTarget.value,
    });
  };

  const renderEditableField = (field: keyof typeof editState) => {
    if (editState[field]) {
      return (
        <Input
          type={field === 'email' ? 'email' : 'text'}
          value={userInfo[field]}
          label={_.startCase(field)}
          onChange={handleUserInfoChange(field)}
          className={s.input}
          textArea={field === 'bio'}
          onBlur={resetEditState}
          onKeyDown={handleKeyDown}
          disabled={updateMutation.isLoading}
          errors={formErrors[_.startCase(field)]}
          autoFocus
        />
      );
    }

    const { DisplayName, Email, Bio } = currentUser;

    switch (field) {
      case 'name':
        return (
          <div className={s.userDisplayName}>
            {DisplayName}
            <FontAwesomeIcon icon={faPenSquare} onClick={() => handleEditState('name')} className={s.editIcon} />
          </div>
        );
      case 'email':
        return (
          <div className={s.userNameEmail}>
            Email: <em>{Email ? Email : 'N/A'}</em>
            <FontAwesomeIcon icon={faPenSquare} onClick={() => handleEditState('email')} className={s.editIcon} />
          </div>
        );
      case 'bio':
        return (
          <div className={s.userNameEmail}>
            Bio: <em>{Bio ? Bio : 'N/A'}</em>
            <FontAwesomeIcon icon={faPenSquare} onClick={() => handleEditState('bio')} className={s.editIcon} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderProfilePhoto = () => {
    return (
      <div className={s.profilePhoto} onClick={() => showModal()}>
        <div className={s.photoCover}>
          <FontAwesomeIcon icon={faFileUpload} className={s.uploadIcon} />
        </div>
        <img
          src={currentUser.ProfilePhoto ? currentUser.ProfilePhoto.Url : '/assets/default.jpeg'}
          alt="profile photo"
        />
      </div>
    );
  };

  return (
    <div className={s.profilePage}>
      <div className={s.content}>
        <div className={s.profileHeader}>
          {renderProfilePhoto()}
          <div className={s.userInfo}>
            {renderEditableField('name')}
            <div className={s.userNameEmail}>User name: <em>{currentUser.UserName}</em></div>
            {renderEditableField('email')}
            {renderEditableField('bio')}
          </div>
          <div className={s.followedActivities}>
            <Link to="/?Following=true">Following {activitiesFollowed} activities</Link>
          </div>
        </div>
        <ProfileContent />
      </div>
      <UploadPhotoModal />
    </div>
  );
};

export default Profile;
