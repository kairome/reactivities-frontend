import React from 'react';
import ActivitiesToolbar from 'ui/Navigation/toolbar/ActivitiesToolbar';
import { useMutation } from 'react-query';
import { logout } from 'api/account';
import Button from 'ui/Button/Button';
import history from 'utils/history';
import { useAlert } from 'recoil/alertState';
import { useRecoilValue } from 'recoil';
import { currentUserState } from 'recoil/user';

import s from './Toolbar.css';

interface Props {
  path: string,
}

const Toolbar: React.FC<Props> = (props) => {
  const { spawnAlert } = useAlert();
  const currentUser = useRecoilValue(currentUserState);

  const logoutMutation = useMutation(logout.name, logout.request, {
    onSuccess: () => {
      spawnAlert({
        type: 'success',
        title: 'You have successfully logged out!',
      });
      history.push('/auth');
    },
  });
  const renderPageBars = () => {
    switch (props.path) {
      case '/':
        return (
          <ActivitiesToolbar />
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {renderPageBars()}
      <div className={s.userName}>
        Hello, {currentUser?.DisplayName}!
      </div>
      <Button theme="footnote" text="Logout" onClick={logoutMutation.mutate} />
    </React.Fragment>
  );
};

export default Toolbar;
