import React from 'react';

import _ from 'lodash';

import s from './Breadcrumbs.css';
import { Link } from 'react-router-dom';

interface BreadcrumbTab {
  title: string,
  path?: string,
}

interface Props {
  tabs: BreadcrumbTab[],
}

const Breadcrumbs: React.FC<Props> = (props) => {
  const renderTabs = () => _.map(props.tabs, (tab, i) => {
    const isLastElem = i === props.tabs.length - 1;

    return (
      <Link
        key={tab.title}
        className={`${s.breadcrumb} ${!tab.path ? s.inactive : ''}`}
        to={tab.path ? tab.path : ''}
      >
        <span>
          {tab.title}
        </span>
        {isLastElem ? null : <span className={s.separator}>{'>'}</span>}
      </Link>
    );
  });

  return (
    <div className={s.breadcrumbs}>
      {renderTabs()}
    </div>
  );
};

export default Breadcrumbs;
