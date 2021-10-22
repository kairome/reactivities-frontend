import React from 'react';
import Button from 'ui/Button/Button';

import s from './Toolbar.css';
import { useSetRecoilState } from 'recoil';
import activitiesFormState from 'recoil/activitiesFormState';
import { useModal } from 'recoil/modalsState';

const ActivitiesToolbar: React.FC = () => {
  const setFormState = useSetRecoilState(activitiesFormState);
  const { showModal } = useModal('addEditActivity');

  const handleAdd = () => {
    setFormState('add');
    showModal();
  };

  return (
    <div className={s.activitiesToolbar}>
      <Button
        text="+ Create activity"
        theme="action"
        className={s.activitiesToolbarBtn}
        onClick={handleAdd}
      />
    </div>
  );
};

export default ActivitiesToolbar;
