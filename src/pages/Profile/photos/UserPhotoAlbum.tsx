import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'recoil/user';
import _ from 'lodash';

import s from './Photos.css';
import { UserPhoto } from 'types/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useMutation, useQueryClient } from 'react-query';
import { deleteUserPhoto, setUserProfilePhoto } from 'api/user';
import { useAlert } from 'recoil/alertState';
import handleApiSuccess from 'api/handleApiSuccess';
import { fetchCurrentUser } from 'api/account';
import handleApiErrors from 'api/handleApiErrors';
import Loader from 'ui/Loader/Loader';

const UserPhotoAlbum: React.FC = () => {
  const { spawnAlert } = useAlert();
  const queryClient = useQueryClient();
  const { Photos, ProfilePhoto } = useRecoilValue(currentUserState);
  const [currentPhoto, setCurrentPhoto] = useState<UserPhoto | null>(null);

  const setMutation = useMutation(setUserProfilePhoto.name, setUserProfilePhoto.request, {
    onSuccess: (data) => {
      queryClient.setQueryData(fetchCurrentUser.name, data);
      setCurrentPhoto(null);
      handleApiSuccess('Profile photo set!', spawnAlert);
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Failed to set profile photo', spawnAlert);
    },
  });

  const deleteMutation = useMutation(deleteUserPhoto.name, deleteUserPhoto.request, {
    onSuccess: (data) => {
      queryClient.setQueryData(fetchCurrentUser.name, data);
      setCurrentPhoto(null);
      handleApiSuccess('Photo deleted!', spawnAlert);
    },
    onError: (err: any) => {
      handleApiErrors(err.Message, 'Failed to delete photo', spawnAlert);
    },
  });

  const handleSetPhoto = () => {
    if (!currentPhoto || setMutation.isLoading) {
      return;
    }

    setMutation.mutate(currentPhoto.Id);
  };

  const handleDeletePhoto = () => {
    if (!currentPhoto || deleteMutation.isLoading) {
      return;
    }

    deleteMutation.mutate(currentPhoto.Id);
  };

  const renderPhotoControls = () => {
    const loader = deleteMutation.isLoading || setMutation.isLoading ? (
      <Loader size="sm" />
    ) : null;

    return (
      <div className={s.controlBtns}>
        <div className={s.setPictureBtn} onClick={handleSetPhoto}>
          {loader ? loader : (<FontAwesomeIcon icon={faCheckCircle} />)}
          <div>Set photo</div>
        </div>
        <div className={s.deletePictureBtn} onClick={handleDeletePhoto}>
          {loader ? loader : (<FontAwesomeIcon icon={faTimesCircle} />)}
          <div>Delete photo</div>
        </div>
      </div>
    );
  };

  const renderAllUserPhotos = () => {
    if (_.isEmpty(Photos) || Photos.length === 1 && Photos[0].Id === ProfilePhoto?.Id) {
      return (
        <div>
          You don't have any photos yet, click on the profile picture to upload more!
        </div>
      );
    }

    return _.map(Photos, (photo, i) => {
      if (photo.Id === ProfilePhoto?.Id) {
        return null;
      }

      const isPhotoOpen = currentPhoto?.Id === photo.Id;

      const photoClasses = classNames(s.userPhoto, {
        [s.photoOpen]: currentPhoto?.Id === photo.Id,
      });

      return (
        <div key={photo.Id} className={photoClasses}>
          <img
            src={photo.Url}
            alt={`profile-photo-${i}`}
            onClick={() => setCurrentPhoto(photo)}
          />
          <div className={s.photoCover} onClick={() => setCurrentPhoto(null)}>
            {isPhotoOpen ? renderPhotoControls() : null}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={s.photoAlbum}>
      {renderAllUserPhotos()}
    </div>
  );
};

export default UserPhotoAlbum;
