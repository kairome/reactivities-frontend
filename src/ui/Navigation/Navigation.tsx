import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';

import _ from 'lodash';

import s from './Navigation.css';
import Toolbar from 'ui/Navigation/toolbar/Toolbar';

import { faLayerGroup, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const navItems = [
  {
    name: 'Activities',
    path: '/',
    icon: faLayerGroup,
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: faUser,
  },
];

const Navigation: React.FC<RouteComponentProps> = (props) => {
  const isRouteActive = (path: string) => (m: any, location: any) => {
    if (path === '/') {
      return path === location.pathname;
    }

    return _.includes(location.pathname, path);
  };

  const renderNavItems = () => {
    return _.map(navItems, (navItem) => {
      return (
        <NavLink
          key={navItem.name}
          to={navItem.path}
          className={s.navItem}
          isActive={isRouteActive(navItem.path)}
          activeClassName={s.activeLink}
        >
          <FontAwesomeIcon icon={navItem.icon} className={s.navIcon} />
          <div className={s.navItemName}>{navItem.name}</div>
        </NavLink>
      );
    });
  };

  return (
    <nav className={s.navigation}>
      <div className={s.navItems}>
        {renderNavItems()}
      </div>
      <Toolbar path={props.location.pathname} />
    </nav>
  );
};

export default withRouter(Navigation);
