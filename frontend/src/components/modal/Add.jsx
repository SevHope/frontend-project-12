import React, {
  useEffect, useRef, useState,
} from 'react';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, FormLabel,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import routes from '../../routes';
import useAuth from '../../hooks/useAuth';
import { actions as channelsActions } from '../../slices/channelsSlice';
import { actions as modalActions } from '../../slices/modalSlice';

const Add = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const auth = useAuth();
  const user = auth.getUser;
  const notify = () => toast.success(t('channels.channelCreated'));
  const onHide = () => dispatch(modalActions.closeModal());
  const validateSchema = yup.object().shape({
    name: yup.string().trim()
      .min(3, t('modals.numberCharacters'))
      .max(20, t('modals.numberCharacters'))
      .required(t('modals.obligatoryField'))
      .notOneOf(allChannels.map((item) => item.name), t('modals.mustUnique')),
  });
  const generateOnSubmit = () => async (values, formikBag) => {
    setIsSubmitting(true);
    const newChannel = { name: values.name, removable: true, author: user.username };
    try {
      await validateSchema.validate(values, { abortEarly: false });
      const response = await axios.post(routes.channelsPath(), newChannel, { headers: { Authorization: `Bearer ${user.token}` } });
      dispatch(channelsActions.moveToChannel(response.data.id));
      notify();
      onHide();
      formikBag.resetForm();
    } catch (error) {
      await formikBag.setErrors({ name: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  const formik = useFormik({
    onSubmit: generateOnSubmit(),
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
            <FormLabel htmlFor="name" visuallyHidden>{t('channels.channelsName')}</FormLabel>
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
};

export default Add;
