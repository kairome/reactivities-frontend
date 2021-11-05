import { useEffect, useState } from 'react';

const useBrowserNotifications = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  useEffect(() => {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      setPermissionGranted(true);
      return;
    }

    Notification.requestPermission().then((permission) => {
      setPermissionGranted(permission === 'granted');
    });
  }, []);

  const spawnNotification = (title: string, body?: string) => {
    if (!permissionGranted) {
      return;
    }

    new Notification(title, { body });
  };

  return { spawnNotification };
};

export default useBrowserNotifications;
