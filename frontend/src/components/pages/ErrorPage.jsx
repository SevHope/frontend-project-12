import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ErrorPage() {
  const { t } = useTranslation();
  return (
    <div>{t('errorPage.notFound')}</div>
  );
}
