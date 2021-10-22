import React, { useState } from 'react';
import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';
import { LoginPayload } from 'types/account';
import { ValidationErrors } from 'types/entities';
import { useAlert } from 'recoil/alertState';
import { useMutation, useQuery } from 'react-query';
import { fetchCurrentUser, login } from 'api/account';
import history from 'utils/history';
import handleApiErrors from 'api/handleApiErrors';

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginPayload>({
    Login: '',
    Password: '',
  });

  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const { spawnAlert } = useAlert();

  const { refetch: loadCurrentUser } = useQuery(fetchCurrentUser.name, fetchCurrentUser.request, { enabled: false });

  const loginMutation = useMutation(login.name, login.request, {
    onSuccess: () => {
      spawnAlert({ type: 'success', title: 'Welcome to reactivities!' });
      loadCurrentUser();
      history.push('/');
    },
    onError: (error: any) => {
      if (error.errors) {
        setFormErrors(error.errors);
      }

      handleApiErrors(error.Message, 'Failed to login', spawnAlert);
    },
  });

  const handleFormChange = (fieldKey: keyof LoginPayload) => (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newData = {
      ...loginData,
      [fieldKey]: e.currentTarget.value,
    };

    setLoginData(newData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation.mutate({
      ...loginData,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="login"
        label="Login"
        value={loginData.Login}
        onChange={handleFormChange('Login')}
        errors={formErrors.Login}
        required
      />
      <Input
        type="password"
        label="Password"
        value={loginData.Password}
        onChange={handleFormChange('Password')}
        errors={formErrors.Password}
        required
      />
      <Button theme="action" text="Login" type="submit" />
    </form>
  );
};

export default LoginForm;
