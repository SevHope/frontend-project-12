import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <div>{t('errorPage.notFound')}</div>
  );
};

export default ErrorPage;
