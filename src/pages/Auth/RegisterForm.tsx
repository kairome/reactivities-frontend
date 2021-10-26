import React, { useState } from 'react';
import Input from 'ui/Input/Input';
import { useMutation } from 'react-query';
import { register } from 'api/account';
import history from 'utils/history';
import handleApiErrors from 'api/handleApiErrors';
import { ValidationErrors } from 'types/entities';
import { useAlert } from 'recoil/alertState';
import {  RegisterPayload } from 'types/account';
import Button from 'ui/Button/Button';

interface Props {
  onSucces: () => void,
}

const RegisterForm: React.FC<Props> = (props) => {
  const { spawnAlert } = useAlert();
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const [registerData, setRegisterData] = useState<RegisterPayload>({
    UserName: '',
    DisplayName: '',
    Password: '',
  });

  const registerMutation = useMutation(register.name, register.request, {
    onSuccess: () => {
      spawnAlert({ type: 'success', title: 'Account created!' });
      props.onSucces();
    },
    onError: (error: any) => {
      if (error.errors) {
        setFormErrors(error.errors);
      }

      handleApiErrors(error.Message, 'Failed to register', spawnAlert);
    },
  });

  const handleFormChange = (fieldKey: keyof RegisterPayload) => (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newData = {
      ...registerData,
      [fieldKey]: e.currentTarget.value,
    };

    setRegisterData(newData);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    registerMutation.mutate({
      ...registerData,
    });
  };


  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="login"
        label="User name"
        value={registerData.UserName}
        onChange={handleFormChange('UserName')}
        errors={formErrors.UserName}
        required
      />
      <Input
        type="password"
        label="Password"
        value={registerData.Password}
        onChange={handleFormChange('Password')}
        errors={formErrors.Password}
        required
      />
      <Input
        type="text"
        label="Display name"
        value={registerData.DisplayName}
        onChange={handleFormChange('DisplayName')}
        errors={formErrors.DisplayName}
        required
      />
      <Input
        type="email"
        label="Email"
        value={registerData.Email ?? ''}
        onChange={handleFormChange('Email')}
        errors={formErrors.Email}
      />
      <Button theme="action" text="Create account" type="submit" />
    </form>
  );
};

export default RegisterForm;
