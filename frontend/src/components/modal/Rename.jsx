/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal, FormGroup, FormControl, FormLabel,
} from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../../routes';

function Rename({ onHide, item }) {
  console.log(item, 'item');
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notify = () => toast.success(t('channels.channelRenamed'));
  const inputRef = useRef(null);
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const { token } = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const initialValues = { name: item.name };

  const validationSchema = yup.object().shape({
    name: yup.string().trim()
      .min(3, t('modals.numberCharacters'))
      .max(20, t('modals.numberCharacters'))
      .required(t('modals.obligatoryField'))
      .notOneOf(allChannels.map((channel) => channel.name), t('modals.mustUnique')),
  });

  const onSubmit = async (values, formikBag) => {
    console.log(values, 'values');
    setIsSubmitting(true);
    const path = [routes.channelsPath(), item.id].join('/');
    console.log(token, 'token');
    try {
      await validationSchema.validate(values, { abortEarly: false });
      await axios.patch(path, values, { headers: { Authorization: `Bearer ${token}` } });
      onHide();
      notify();
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
                  ref={inputRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  name="name"
                  id="name"
                />
                <FormLabel htmlFor="name" className="form-label visually-hidden">{t('channels.channelsName')}</FormLabel>
                {touched.name && errors.name && (
                <div className="error text-danger">{errors.name}</div>
                )}
              </FormGroup>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2">{t('modals.send')}</button>
              <button type="button" disabled={isSubmitting} className="btn btn-secondary mt-2 ml-2" onClick={onHide}>{t('modals.cancel')}</button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default Rename;
