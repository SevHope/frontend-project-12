/* eslint-disable react/prop-types */
import React, {
  useEffect, useRef, useState,
} from 'react';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import routes from '../../routes';

function Add({ onHide }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const { username, token } = JSON.parse(localStorage.getItem('userId'));
  const validateSchema = yup.object().shape({
    name: yup.string().trim()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(allChannels.map((item) => item.name), 'Должно быть уникальным'),
  });
  const generateOnSubmit = () => async (values, formikBag) => {
    setIsSubmitting(true);
    const newChannel = { name: values.name, removable: true, author: username };
    try {
      await validateSchema.validate(values, { abortEarly: false });
      await axios.post(routes.channelsPath(), newChannel, { headers: { Authorization: `Bearer ${token}` } });
      onHide();
      formikBag.resetForm();
    } catch (error) {
      formikBag.setErrors({ name: error.message });
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
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
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
          <input type="submit" disabled={isSubmitting} className="btn btn-primary mt-2" value="Отправить" />
          <input type="reset" disabled={isSubmitting} className="btn btn-secondary mt-2 ml-2" value="Отменить" onClick={onHide} />
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Add;
