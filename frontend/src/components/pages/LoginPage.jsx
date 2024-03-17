/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/auth';
import routes from '../../routes';

function LoginPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const noNetworkError = () => toast.error(t('error.networkError'));
  const dataLoadingError = () => toast.error(t('error.dataLoadingError'));
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.loginPath(), values);
        auth.userName = res.data.username;
        auth.logIn(res);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.message === 'Network Error') {
          noNetworkError();
        }
        if (err.status === 500) {
          dataLoadingError();
        }
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="p-3">
            <fieldset>
              <Form.Group>
                <Form.Label htmlFor="username" />
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder={t('login.login')}
                  name="username"
                  id="username"
                  autoComplete="username"
                  isInvalid={authFailed}
                  required
                  ref={inputRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password" />
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder={t('login.password')}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  isInvalid={authFailed}
                  required
                />
                <Form.Control.Feedback type="invalid">{t('login.submissionFailed')}</Form.Control.Feedback>
              </Form.Group>
              <div className="d-grid d-flex justify-content-md-center">
                <Button type="submit" className="mt-3" variant="outline-primary">{t('login.loginButton')}</Button>
              </div>
            </fieldset>
          </Form>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="card-footer p-4">
          <span>{t('login.noAccount')}</span>
          <Link to="/signup">{t('login.registration')}</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
