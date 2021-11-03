import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  title: string,
}

const TabTitle: React.FC<Props> = (props) => {
  return (
    <Helmet>
      <title>{props.title}</title>
    </Helmet>
  );
};

export default TabTitle;
