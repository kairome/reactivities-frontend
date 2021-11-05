import React, { useEffect, useRef } from 'react';
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
import ScrollTopProvider from 'context/ScrollTopProvider';
import history from 'utils/history';
import { ApiError } from 'types/entities';

const App: React.FC = () => {
  const { data: currentUser, isLoading } = useQuery(fetchCurrentUser.name, fetchCurrentUser.request, {
    onError: (err: ApiError) => {
      if (err.status === 404) {
        history.push('/auth');
      }
    },
  });
  const setCurrentUser = useSetRecoilState(currentUserState);

  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser]);

  const renderAppRoutes = () => {
    if (isLoading || !currentUser) {
      return (
        <div className={s.pageLoader}>
          <Loader size="xxl" />
        </div>
      );
    }


    return (
      <React.Fragment>
        <Navigation />
        <ScrollTopProvider containerRef={pageRef}>
          <div className={s.page} id="page" ref={pageRef}>
            <Routes />
          </div>
        </ScrollTopProvider>
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
