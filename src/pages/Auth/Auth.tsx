import React, { useState } from 'react';

import s from './Auth.css';
import LoginForm from 'pages/Auth/LoginForm';
import RegisterForm from 'pages/Auth/RegisterForm';

type AuthForm = 'login' | 'register';

const Auth: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<AuthForm>('login');

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return (<LoginForm />);
      case 'register':
        return (<RegisterForm onSucces={() => setCurrentForm('login')}/>);
      default:
        return null;
    }
  };

  const renderFormSwitcher = () => {
    switch (currentForm) {
      case 'login':
        return (
          <div onClick={() => setCurrentForm('register')} className={s.switcher}>
            Don't have an account? Register now!
          </div>
        );
      case 'register':
        return (
          <div onClick={() => setCurrentForm('login')} className={s.switcher}>
            Already have an account? Log in now!
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={s.page}>
      <div>
        Welcome to reactivities...
      </div>
      <div className={s.authContainer}>
        <div className={s.authForm}>
          {renderForm()}
          {renderFormSwitcher()}
        </div>
        <div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
