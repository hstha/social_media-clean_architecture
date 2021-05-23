import { useField } from 'formik';
import React, { ReactElement } from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  rows: number;
}

export const MyTextArea = (props: Props): ReactElement => {
  const [field, meta] = useField(props);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label?.toUpperCase()}</label>
      <textarea {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};
