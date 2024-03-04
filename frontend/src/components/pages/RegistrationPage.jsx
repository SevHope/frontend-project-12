/* eslint-disable react/react-in-jsx-scope */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useAuth from '../../hooks/auth';
import routes from '../../routes';

function RegistrationPage() {
  const auth = useAuth();
  const [regFailed, setRegFailed] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  const validateSchema = yup.object().shape({
    username: yup.string().trim()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: yup.string().trim()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    passwordConfirm: yup.string()
      .required('обязательное поле')
      .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
  });
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    onSubmit: (values, formikBag) => validateSchema.validate(values)
      .then(() => axios.post(routes.registrationPath(), values))
      .then((response) => {
        console.log(response, 'response.data');
        console.log(values, 'values');
        setRegFailed(false);
        return axios.post(routes.loginPath(), values);
      })
      .then((response) => {
        console.log(response, 'response');
        localStorage.setItem('userId', JSON.stringify(response.data));
        auth.logIn();
        auth.userName = response.data.username;
        navigate('/');
      })
      .catch((err) => {
        formikBag.setErrors({ name: err.message });
        console.log(err.message, 'error.message');
        console.log(formik.errors, 'formik.errors');
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setRegFailed(true);
          inputRef.current.select();
        }
        if (err.isAxiosError && err.response.status === 409) {
          console.log('такой логин уже есть');
          setRegFailed(true);
          inputRef.current.select();
        }
        throw err;
      }),
  });
  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="form-group border">
          <Form className="p-3 bg-light" autoComplete="off" onSubmit={formik.handleSubmit}>
            <fieldset>
              <legend className="mb-4 text-center fs-4 fw-bold">Регистрация</legend>
              <Form.Group>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder="Имя пользователя"
                  name="username"
                  id="username"
                  required
                  autoComplete="new-password"
                  ref={inputRef}
                  isInvalid={regFailed}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className="mt-3"
                  type="password"
                  placeholder="Пароль"
                  name="password"
                  id="password"
                  required
                  autoComplete="new-password"
                  isInvalid={regFailed}
                />
                <Form.Control
                  onChange={formik.handleChange}
                  className="mt-3"
                  placeholder="Подтвердите пароль"
                  value={formik.values.passwordConfirm}
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  required
                  autoComplete="new-passwordConfirm"
                  isInvalid={regFailed}
                />
                <div className="error text-danger">{formik.errors.name}</div>
              </Form.Group>
              <div className="text-center mt-5">
                <Button type="submit" variant="outline-primary">Зарегистрироваться</Button>
              </div>
            </fieldset>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
