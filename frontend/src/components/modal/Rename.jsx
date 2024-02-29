/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../../routes';

function Rename({ onHide, item }) {
  console.log(item, 'item v rename');
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  console.log(allChannels, 'allchannels v Rename');
  const { token } = JSON.parse(localStorage.getItem('userId'));
  const validateSchema = yup.object().shape({
    name: yup.string().trim()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(allChannels.map((channel) => channel.name), 'Должно быть уникальным'),
  });
  const generateOnSubmit = () => async (values, formikBag) => {
    console.log(values, 'values новое имя канала');
    const path = [routes.channelsPath(), item].join('/');
    console.log(path, 'path v rename');
    console.log(token, 'token v Rename');
    try {
      await validateSchema.validate(values, { abortEarly: false });
      await axios.patch(path, values, { headers: { Authorization: `Bearer ${token}` } });
      console.log(values, 'newChannel');
      onHide();
      formikBag.resetForm();
    } catch (error) {
      console.log('oshibka v rename');
      formikBag.setErrors({ name: error.message });
    }
  };
  const f = useFormik({
    onSubmit: generateOnSubmit(),
    initialValues: { name: '' },
  });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              data-testid="input-body"
              name="name"
            />
            {f.touched.name && f.errors.name && (
            <div className="error text-danger">{f.errors.name}</div>
            )}
          </FormGroup>
          <input type="reset" className="btn btn-secondary mt-2" value="Отменить" onClick={onHide} />
          <input type="submit" className="btn btn-primary mt-2 ml-2" value="Отправить" />
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Rename;
