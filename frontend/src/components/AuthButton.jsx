import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import routes from '../routes';

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    auth.getUser !== null
      ? <Button onClick={auth.logOut} as={Link} to={routes.loginPagePath()} state={{ from: location }}>{t('header.goOut')}</Button>
      : null
  );
};

export default AuthButton;
