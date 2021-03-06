import React, { useEffect, useState } from 'react';
import { ActivityItem, CreateActivityPayload } from 'types/activity';
import Button from 'ui/Button/Button';
import { useMutation, useQueryClient } from 'react-query';
import { createEditActivity, fetchActivity } from 'api/activities';
import Input from 'ui/Input/Input';

import s from './Activities.css';
import Modal from 'ui/Modal/Modal';
import { useAlert } from 'recoil/alertState';

import handleApiErrors from 'api/handleApiErrors';
import handleApiSuccess from 'api/handleApiSuccess';
import { ApiError, ValidationErrors } from 'types/entities';

import DateInput from 'ui/DateInput/DateInput';
import history from 'utils/history';
import useModal from 'hooks/useModal';
import dayjs from 'dayjs';

interface Props {
  activity: ActivityItem | null,
  updateListData?: (newAct: ActivityItem) => void,
}

const defaultPayload = {
  Title: '',
  Description: '',
  Category: '',
  Date: dayjs().format('YYYY-MM-DD[T]HH:mm:ss'),
  City: '',
  Venue: '',
};

const modalKey = 'addEditActivity';

const AddEditActivityModal: React.FC<Props> = (props) => {
  const queryClient = useQueryClient();
  const { spawnAlert } = useAlert();

  const { closeModal, isModalOpen } = useModal(modalKey);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const { activity } = props;

  const [formData, setFormData] = useState<CreateActivityPayload>(defaultPayload);

  const addEditMutation = useMutation(createEditActivity.name, createEditActivity.request, {
    onSuccess: (data, editPayload) => {
      handleApiSuccess(editPayload.Id ? 'Activity edited!' : 'Activity added!', spawnAlert);

      if (!editPayload.Id) {
        history.push(`/activity/${data.Id}`);
        closeModal();
        return;
      }

      if (props.updateListData) {
        props.updateListData(data);
        return;
      }

      queryClient.setQueryData<ActivityItem>([fetchActivity.name, editPayload.Id], data);
    },
    onError: (error: ApiError) => {
      if (error.data.errors) {
        setFormErrors(error.data.errors);
      }

      handleApiErrors(error, `Failed to ${activity ? 'edit' : 'create'} activity`, spawnAlert);
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      setFormErrors({});
      setFormData(activity ? activity : defaultPayload);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!activity) {
      setFormData(defaultPayload);
      return;
    }

    setFormData(activity);
  }, [activity]);

  useEffect(() => {
    if (addEditMutation.status === 'success') {
      closeModal();
    }
  }, [addEditMutation.status]);

  const handleFormChange = (fieldKey: keyof CreateActivityPayload) => (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newData = {
      ...formData,
      [fieldKey]: e.currentTarget.value,
    };

    setFormData(newData);
  };

  const handleDateChange = (v: string) => {
    setFormData({
      ...formData,
      Date: v,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEditMutation.mutate(formData);
  };

  const renderAddFields = () => {
    if (activity) {
      return null;
    }

    return (
      <React.Fragment>
        <DateInput
          value={formData.Date}
          onChange={handleDateChange}
          errors={formErrors.Date}
          format="dd/MM/yy HH:mm"
        />
        <Input
          type="text"
          label="City"
          value={formData.City}
          onChange={handleFormChange('City')}
          errors={formErrors.City}
          required
        />
        <Input
          type="text"
          label="Venue"
          value={formData.Venue}
          onChange={handleFormChange('Venue')}
          errors={formErrors.Venue}
          required
        />
      </React.Fragment>
    );
  };

  return (
    <Modal modalKey={modalKey} title={activity ? 'Edit activity' : 'Add activity'}>
      <form onSubmit={handleSubmit} className={s.activityForm}>
        <Input
          type="text"
          label="Title"
          value={formData.Title}
          onChange={handleFormChange('Title')}
          errors={formErrors.Title}
          required
        />
        <Input
          type="text"
          label="Description"
          value={formData.Description}
          onChange={handleFormChange('Description')}
          errors={formErrors.Description}
          textArea
        />
        {renderAddFields()}
        <Input
          type="text"
          label="Category"
          value={formData.Category}
          onChange={handleFormChange('Category')}
          errors={formErrors.Category}
        />
        <div className={s.activityViewFooter}>
          <Button
            theme="action"
            type="submit"
            text="Submit"
            disabled={addEditMutation.isLoading}
            isLoading={addEditMutation.isLoading}
          />
          <Button
            type="button"
            theme="danger"
            text="Cancel"
            onClick={closeModal}
          />
        </div>
      </form>
    </Modal>

  );
};

export default AddEditActivityModal;
