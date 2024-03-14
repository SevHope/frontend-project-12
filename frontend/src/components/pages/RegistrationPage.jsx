/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/react-in-jsx-scope */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useAuth from '../../hooks/auth';
import routes from '../../routes';

function RegistrationPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const noNetworkError = () => toast.error(t('error.networkError'));
  const dataLoadingError = () => toast.error(t('error.dataLoadingError'));
  const [regFailed, setRegFailed] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  const validateSchema = yup.object().shape({
    username: yup.string().trim()
      .min(3, t('signup.numberCharacters'))
      .max(20, t('signup.numberCharacters'))
      .required(t('signup.obligatoryField')),
    password: yup.string().trim()
      .min(6, t('signup.minCharacters'))
      .required(t('signup.obligatoryField')),
    passwordConfirm: yup.string()
      .required(t('signup.obligatoryField'))
      .oneOf([yup.ref('password'), null], t('signup.passwordsMustMatch')),
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
      .then(() => {
        setRegFailed(false);
        return axios.post(routes.loginPath(), values);
      })
      .then((response) => {
        localStorage.setItem('userId', JSON.stringify(response.data));
        auth.logIn();
        auth.userName = response.data.username;
        navigate('/');
      })
      .catch((err) => {
        formikBag.setErrors({ name: err.message });
        formik.setSubmitting(false);
        if (err.message === 'Network Error') {
          noNetworkError();
        }
        if (err.status === 500) {
          dataLoadingError();
        }
        if (err.isAxiosError && err.response.status === 401) {
          setRegFailed(true);
          inputRef.current.select();
        }
        if (err.isAxiosError && err.response.status === 409) {
          formikBag.setErrors({ name: t('signup.alreadyExists') });
          setRegFailed(true);
          inputRef.current.select();
        }
        throw err;
      }),
  });
  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="form-group border col-4">
          <Form className="p-3 bg-light" autoComplete="off" onSubmit={formik.handleSubmit}>
            <fieldset>
              <legend className="mb-4 text-center fs-4 fw-bold">{t('signup.registration')}</legend>
              <Form.Group>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder={t('signup.userName')}
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
                  placeholder={t('signup.password')}
                  name="password"
                  id="password"
                  required
                  autoComplete="new-password"
                  isInvalid={regFailed}
                />
                <Form.Control
                  onChange={formik.handleChange}
                  className="mt-3"
                  placeholder={t('signup.confirmPassword')}
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
                <Button type="submit" variant="outline-primary">{t('signup.register')}</Button>
              </div>
            </fieldset>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
