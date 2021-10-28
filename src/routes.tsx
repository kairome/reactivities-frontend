import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Activities from 'pages/Activities/Activities';
import _ from 'lodash';
import Activity from 'pages/Activity/Activity';
import Profile from 'pages/Profile/Profile';


const routes = [
  {
    title: 'Activity',
    component: Activity,
    path: '/activity/:id',
    exact: false,
  },
  {
    title: 'Profile',
    component: Profile,
    path: '/profile',
    exact: true,
  },
  {
    title: 'Activities',
    component: Activities,
    path: '/',
    exact: false,
  },
];

const Routes: React.FC = () => {
  const renderRoutes = () => {
    return _.map(routes, (route) => (
      <Route key={route.path} component={route.component} exact={route.exact} path={route.path} />
    ));
  };

  return (
    <Switch>
      {renderRoutes()}
    </Switch>
  );
};

export default Routes;
