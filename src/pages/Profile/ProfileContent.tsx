import React, { useState } from 'react';
import Tabs from 'ui/Tabs/Tabs';
import UserPhotoAlbum from 'pages/Profile/photos/UserPhotoAlbum';

const ProfileContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('photos');

  const renderContent = () => {
    switch (activeTab) {
      case 'photos':
        return (
          <UserPhotoAlbum />
        );
      default:
        return null;
    }
  };

  const tabs = [
    {
      id: 'photos',
      title: 'Photos',
    },
    {
      id: 'events',
      title: 'Events',
    },
    {
      id: 'followers',
      title: 'Followers',
    },
    {
      id: 'following',
      title: 'Following',
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default ProfileContent;
