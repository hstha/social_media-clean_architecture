import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react';
import { Button, Label } from 'semantic-ui-react';
import { MyInput } from '../../core/common/form';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../core/stores/store';
import ValidationErrors from '../errors/ValidationErrors';

const validationSchema = Yup.object({
  email: Yup.string().required('The activity email is required').email(),
  password: Yup.string().required('The activity password is required'),
  displayName: Yup.string().required('The activity displayName is required'),
  userName: Yup.string().required('The activity password userNames required'),
});

const RegisterForm = (): JSX.Element => {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        displayName: '',
        userName: '',
        error: null,
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className='ui form error'
          onSubmit={handleSubmit}
          autoComplete='off'
        >
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
          <MyInput
            name='displayName'
            placeholder='Display Name'
            label='Display Name'
          />
          <MyInput name='userName' placeholder='User Name' label='User Name' />
          <ErrorMessage
            name='error'
            render={() => <ValidationErrors errors={errors.error} />}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
            type='submit'
            positive
            content='Register'
            fluid
          />
        </Form>
      )}
    </Formik>
  );
};

export default observer(RegisterForm);
