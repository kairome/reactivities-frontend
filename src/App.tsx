import React, { useEffect } from 'react';
import './App.css';
import Routes from 'routes';
import Navigation from 'ui/Navigation/Navigation';

import s from './App.css';

import AlertContainer from 'ui/Alert/AlertContainer';
import { Route, Switch } from 'react-router-dom';
import Auth from 'pages/Auth/Auth';
import { useQuery } from 'react-query';
import { fetchCurrentUser } from 'api/account';
import Loader from 'ui/Loader/Loader';
import { useSetRecoilState } from 'recoil';
import { currentUserState } from 'recoil/user';

const App: React.FC = () => {
  const { data: currentUser, isLoading } = useQuery(fetchCurrentUser.name, fetchCurrentUser.request);
  const setCurrentUser = useSetRecoilState(currentUserState);

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser]);

  const renderAppRoutes = () => {
    if (isLoading) {
      return (
        <div className={s.pageLoader}>
          <Loader size="xxl" />
        </div>
      );
    }


    return (
      <React.Fragment>
        <Navigation />
        <div className={s.page}>
          <Routes />
        </div>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <AlertContainer />
      <Switch>
        <Route path="/auth" exact component={Auth} />
        <Route path="/" render={renderAppRoutes} />
      </Switch>
    </React.Fragment>
  );
};

export default App;
