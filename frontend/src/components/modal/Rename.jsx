/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../../routes';

function Rename({ onHide, item }) {
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
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(allChannels.map((channel) => channel.name), 'Должно быть уникальным'),
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
        <Modal.Title>Переименовать канал</Modal.Title>
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
              <input type="submit" disabled={isSubmitting} className="btn btn-primary mt-2" value="Отправить" />
              <input type="reset" disabled={isSubmitting} className="btn btn-secondary mt-2 ml-2" value="Отменить" onClick={onHide} />
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default Rename;
