import React from 'react';

import _ from 'lodash';
// import { useHistory } from 'react-router-dom';

import s from './Breadcrumbs.css';
import history from 'utils/history';
interface BreadcrumbTab {
  title: string,
  path?: string,
}

interface Props {
  tabs: BreadcrumbTab[],
}

const Breadcrumbs: React.FC<Props> = (props) => {
  // const history = useHistory();
  const renderTabs = () => _.map(props.tabs, (tab, i) => {
    const isLastElem = i === props.tabs.length - 1;

    return (
      <div
        key={tab.title}
        className={`${s.breadcrumb} ${!tab.path ? s.inactive : ''}`}
        onClick={() => tab.path ? history.push(tab.path) : _.noop}
      >
        <span>
          {tab.title}
        </span>
        {isLastElem ? null : <span className={s.separator}>{'>'}</span>}
      </div>
    );
  });

  return (
    <div className={s.breadcrumbs}>
      {renderTabs()}
    </div>
  );
};

export default Breadcrumbs;
