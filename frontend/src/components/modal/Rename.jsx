/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../../routes';

function Rename({ onHide, item }) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const { token } = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const initialValues = { name: '' };

  const validationSchema = yup.object().shape({
    name: yup.string().trim()
      .min(3, t('modals.numberCharacters'))
      .max(20, t('modals.numberCharacters'))
      .required(t('modals.obligatoryField'))
      .notOneOf(allChannels.map((channel) => channel.name), t('modals.mustUnique')),
  });

  const onSubmit = async (values, formikBag) => {
    setIsSubmitting(true);
    const path = [routes.channelsPath(), item].join('/');
    try {
      await validationSchema.validate(values, { abortEarly: false });
      await axios.patch(path, values, { headers: { Authorization: `Bearer ${token}` } });
      onHide();
      formikBag.resetForm();
    } catch (error) {
      formikBag.setErrors({ name: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values, errors, touched, handleChange, handleBlur, handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormControl
                  required
                  ref={inputRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  data-testid="input-body"
                  name="name"
                />
                {touched.name && errors.name && (
                <div className="error text-danger">{errors.name}</div>
                )}
              </FormGroup>
              <input type="submit" disabled={isSubmitting} className="btn btn-primary mt-2" value={t('modals.send')} />
              <input type="reset" disabled={isSubmitting} className="btn btn-secondary mt-2 ml-2" value={t('modals.cancel')} onClick={onHide} />
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default Rename;
