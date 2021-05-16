import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react';
import { Button, Label } from 'semantic-ui-react';
import { MyInput } from '../../core/common/form';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../core/stores/store';

const validationSchema = Yup.object({
  email: Yup.string().required('The activity email is required'),
  password: Yup.string().required('The activity password is required'),
});

const LoginForm = (): JSX.Element => {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={({ email, password }, { setErrors }) =>
        userStore
          .login({ email, password })
          .catch(() => setErrors({ error: 'Invalid Email and Password' }))
      }
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
          <MyInput
            name='email'
            placeholder='Email'
            label='Email'
            type='email'
          />
          <MyInput
            name='password'
            placeholder='Password'
            label='Password'
            type='password'
          />
          <ErrorMessage
            name='error'
            render={() => (
              <Label
                style={{ marginBottom: 10 }}
                basic
                color='red'
                content={errors.error}
              />
            )}
          />
          <Button
            loading={isSubmitting}
            type='submit'
            positive
            content='Login'
            fluid
          />
        </Form>
      )}
    </Formik>
  );
};

export default observer(LoginForm);
