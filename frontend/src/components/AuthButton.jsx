import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import useAuth from '../hooks/auth';

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} as={Link} to="/login" state={{ from: location }}>{t('header.goOut')}</Button>
      : null
  );
}

export default AuthButton;
