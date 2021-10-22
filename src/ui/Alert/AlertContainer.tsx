import React from 'react';

import s from './Alert.css';
import { useAlert } from 'recoil/alertState';

import _ from 'lodash';
import Alert from 'ui/Alert/Alert';

const AlertContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

  const renderAlerts = () => {
    return _.map(alerts, (alertItem) => {
      return (
        <Alert
          key={alertItem.id}
          alertItem={alertItem}
          onRemove={() => removeAlert(alertItem.id)}
        />
      );
    });
  };

  return (
    <div className={s.alertContainer}>
      {renderAlerts()}
    </div>
  );
};

export default AlertContainer;
