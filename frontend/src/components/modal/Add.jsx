/* eslint-disable react/prop-types */
import React, {
  useEffect, useRef,
} from 'react';
// import _ from 'lodash';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import routes from '../../routes';

function Add({ onHide }) {
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const { token } = JSON.parse(localStorage.getItem('userId'));
  console.log(token, 'token v Add');
  const validateSchema = yup.object().shape({
    name: yup.string().trim()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(allChannels.map((item) => item.name), 'Должно быть уникальным'),
  });
  const generateOnSubmit = () => async (values, formikBag) => {
    const newChannel = { name: values.name, removable: true };
    try {
      await validateSchema.validate(values, { abortEarly: false });
      await axios.post(routes.channelsPath(), newChannel, { headers: { Authorization: `Bearer ${token}` } });
      onHide();
      formikBag.resetForm();
    } catch (error) {
      formikBag.setErrors({ name: error.message });
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
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Введите название канала</Modal.Title>
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
          <input type="submit" className="btn btn-primary mt-2" value="добавить" />
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Add;
