/* eslint-disable react/prop-types */
import React, {
  useEffect, useRef, useState,
} from 'react';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, FormLabel,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import routes from '../../routes';

function Add({ onHide }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const { username, token } = JSON.parse(localStorage.getItem('userId'));
  const notify = () => toast.success(t('channels.channelCreated'));
  const validateSchema = yup.object().shape({
    name: yup.string().trim()
      .min(3, t('modals.numberCharacters'))
      .max(20, t('modals.numberCharacters'))
      .required(t('modals.obligatoryField'))
      .notOneOf(allChannels.map((item) => item.name), t('modals.mustUnique')),
  });
  const generateOnSubmit = () => async (values, formikBag) => {
    setIsSubmitting(true);
    const newChannel = { name: values.name, removable: true, author: username };
    try {
      await validateSchema.validate(values, { abortEarly: false });
      await axios.post(routes.channelsPath(), newChannel, { headers: { Authorization: `Bearer ${token}` } });
      notify();
      onHide();
      formikBag.resetForm();
    } catch (error) {
      await formikBag.setErrors({ name: error.message });
      console.log(formikBag.errors, 'formikBag');
    } finally {
      setIsSubmitting(false);
    }
  };
  const formik = useFormik({
    onSubmit: generateOnSubmit({ onHide }),
    initialValues: { name: '' },
  });

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal centered show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name" />
            <FormControl
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
            />
            {formik.touched.name && formik.errors.name && (
            <div className="error text-danger">{formik.errors.name}</div>
            )}
          </FormGroup>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2">{t('modals.send')}</button>
          <button type="button" disabled={isSubmitting} className="btn btn-secondary mt-2 ml-2" onClick={onHide}>{t('modals.cancel')}</button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Add;
