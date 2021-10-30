import React, { useEffect } from 'react';
import Modal from 'ui/Modal/Modal';
import UserProfileCard from 'ui/UserProfileCard/UserProfileCard';
import Loader from 'ui/Loader/Loader';
import { useQuery } from 'react-query';
import { fetchUserProfile } from 'api/user';
import Button from 'ui/Button/Button';
import { useModal } from 'recoil/modalsState';

interface Props {
  userId: string,
}

const modalKey = 'userProfile';

const UserProfileModal: React.FC<Props> = (props) => {
  const { userId } = props;

  const { closeModal } = useModal('');

  const {
    isLoading,
    data: userProfile,
    refetch: loadUserProfile,
  } = useQuery([fetchUserProfile.name, userId], () => fetchUserProfile.request(userId), {
    enabled: false,
  });

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Loader />
      );
    }

    return (
      <UserProfileCard profile={userProfile} />
    );
  };

  return (
    <Modal title="User profile" modalKey={`${modalKey}-${userId}`}>
      {renderContent()}
      <Button theme="primary" text="Close" onClick={() => closeModal(`${modalKey}-${userId}`)}/>
    </Modal>
  );
};

export default UserProfileModal;
