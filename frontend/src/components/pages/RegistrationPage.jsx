/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
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

  const initialValues = {
    username: '',
    password: '',
    passwordConfirm: '',
  };

  const onSubmit = async (values, formikBag) => {
    try {
      await validateSchema.validate(values);
      await axios.post(routes.registrationPath(), values);
      setRegFailed(false);
      const response = await axios.post(routes.loginPath(), values);
      localStorage.setItem('userId', JSON.stringify(response.data));
      auth.login();
      auth.username = response.data.username;
      navigate('/');
    } catch (err) {
      formikBag.setErrors({ name: err.message });
      formikBag.setSubmitting(false);
      if (err.message === 'network error') {
        noNetworkError();
      }
      if (err.response.status === 500) {
        dataLoadingError();
      }
      if (err.isaxioserror && err.response.status === 401) {
        setRegFailed(true);
        inputRef.current.select();
      }
      if (err.isaxioserror && err.response.status === 409) {
        formikBag.seterrors({ name: t('signup.alreadyexists') });
        setRegFailed(true);
        inputRef.current.select();
      }
      throw err;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="form-group border col-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={onSubmit}
            validateOnChange
          >
            {({
              values, errors, touched, handleChange, handleBlur, handleSubmit,
            }) => (
              <Form className="p-3 bg-light" autoComplete="off" onSubmit={handleSubmit}>
                <fieldset>
                  <legend className="mb-4 text-center fs-4 fw-bold">{t('signup.registration')}</legend>
                  <Form.Group>
                    <Form.Control
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      placeholder={t('signup.userName')}
                      name="username"
                      id="username"
                      required
                      autoComplete="new-password"
                      ref={inputRef}
                      isInvalid={regFailed}
                    />
                    {touched.username && errors.username && (
                    <div className="error text-danger">{errors.username}</div>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      onChange={handleChange}
                      value={values.password}
                      className="mt-3"
                      type="password"
                      placeholder={t('signup.password')}
                      name="password"
                      id="password"
                      required
                      autoComplete="new-password"
                      isInvalid={regFailed}
                    />
                    {touched.password && errors.password && (
                    <div className="error text-danger">{errors.password}</div>
                    )}
                    <Form.Control
                      onChange={handleChange}
                      className="mt-3"
                      placeholder={t('signup.confirmPassword')}
                      value={values.passwordConfirm}
                      type="password"
                      name="passwordConfirm"
                      id="passwordConfirm"
                      required
                      autoComplete="new-passwordConfirm"
                      isInvalid={regFailed}
                    />
                    {touched.passwordConfirm && errors.passwordConfirm && (
                    <div className="error text-danger">{errors.passwordConfirm}</div>
                    )}
                  </Form.Group>
                  <div className="text-center mt-5">
                    <Button type="submit" variant="outline-primary">{t('signup.register')}</Button>
                  </div>
                </fieldset>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
