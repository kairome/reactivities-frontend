import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'recoil/user';
import _ from 'lodash';

import s from './Photos.css';
import { UserPhoto } from 'types/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useMutation } from 'react-query';
import { deleteUserPhoto, setUserProfilePhoto } from 'api/user';
import { useAlert } from 'recoil/alertState';
import handleApiSuccess from 'api/handleApiSuccess';
import { fetchCurrentUser } from 'api/account';
import handleApiErrors from 'api/handleApiErrors';
import Loader from 'ui/Loader/Loader';
import ConfirmationModal from 'ui/ConfirmationModal/ConfirmationModal';
import useQueryUpdate from 'api/useQueryUpdate';
import useOutsideClick from 'hooks/useOutsideClick';
import useModal from 'hooks/useModal';
import { ApiError } from 'types/entities';

const UserPhotoAlbum: React.FC = () => {
  const { spawnAlert } = useAlert();
  const updateQuery = useQueryUpdate();
  const currentUser = useRecoilValue(currentUserState);
  const [currentPhoto, setCurrentPhoto] = useState<UserPhoto | null>(null);
  const { showModal: showDeleteConfirmation } = useModal('deletePhotoConfirmation');

  const container = useOutsideClick(() => setCurrentPhoto(null));

  const setMutation = useMutation(setUserProfilePhoto.name, setUserProfilePhoto.request, {
    onSuccess: (data) => {
      updateQuery(fetchCurrentUser.name, data);
      setCurrentPhoto(null);
      handleApiSuccess('Profile photo set!', spawnAlert);
    },
    onError: (err: ApiError) => {
      handleApiErrors(err, 'Failed to set profile photo', spawnAlert);
    },
  });

  const deleteMutation = useMutation(deleteUserPhoto.name, deleteUserPhoto.request, {
    onSuccess: (data) => {
      updateQuery(fetchCurrentUser.name, data);
      setCurrentPhoto(null);
      handleApiSuccess('Photo deleted!', spawnAlert);
    },
    onError: (err: ApiError) => {
      handleApiErrors(err, 'Failed to delete photo', spawnAlert);
    },
  });

  if (!currentUser) {
    return null;
  }

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

  const handleDeleteConfirmation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    showDeleteConfirmation();
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
        <div className={s.deletePictureBtn} onClick={handleDeleteConfirmation}>
          {loader ? loader : (<FontAwesomeIcon icon={faTimesCircle} />)}
          <div>Delete photo</div>
        </div>
      </div>
    );
  };

  const renderAllUserPhotos = () => {
    const { ProfilePhoto, Photos } = currentUser;
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
          <div className={s.photoCover} onClick={() => setCurrentPhoto(null)}>
            {isPhotoOpen ? renderPhotoControls() : null}
          </div>
          <img
            src={photo.Url}
            alt={`profile-photo-${i}`}
            onClick={() => setCurrentPhoto(photo)}
          />
        </div>
      );
    });
  };

  return (
    <div className={s.photoAlbum} ref={container}>
      {renderAllUserPhotos()}
      <ConfirmationModal
        modalKey="deletePhotoConfirmation"
        title="Delete profile photo"
        text="Are you sure you want to delete this photo? This action is irreversible"
        status={deleteMutation.status}
        action={handleDeletePhoto}
      />
    </div>
  );
};

export default UserPhotoAlbum;
