import React from 'react';
import { TabItem } from 'types/entities';
import _ from 'lodash';

import s from './Tabs.css';
import classNames from 'classnames';

interface Props {
  tabs: TabItem[],
  active: string,
  onChange: (t: string) => void,
}

const Tabs: React.FC<Props> = (props) => {
  const { tabs } = props;

  const renderTabs = () => _.map(tabs, (tab) => {
    const tabClassName = classNames(s.tab, {
      [s.active]: props.active === tab.id,
    });
    return (
      <div key={tab.id} onClick={() => props.onChange(tab.id)} className={tabClassName}>
        {tab.title}
      </div>
    );
  });

  return (
    <div className={s.tabs}>
      {renderTabs()}
    </div>
  );
};

export default Tabs;
