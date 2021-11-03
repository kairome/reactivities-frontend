import React from 'react';

import s from './NotFound.css';
import { Link } from 'react-router-dom';

interface Props {
  entityName: string,
  link: string,
  linkText: string,
}

const NotFound: React.FC<Props> = (props) => {
  const { entityName, link, linkText } = props;
  return (
    <div className={s.notFoundContainer}>
      <div className={s.notFound}>
        <div>{entityName} not found :(</div>
        <Link to={link} className={s.link}>Go back to {linkText}</Link>
      </div>
    </div>
  );
};

export default NotFound;
