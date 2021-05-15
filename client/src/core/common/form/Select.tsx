import { useField } from 'formik';
import React, { ReactElement } from 'react';
import { Form, Label, Select } from 'semantic-ui-react';

interface Option {
  text: string;
  value: string;
}

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  options: Option[];
}

export const MySelect = (props: Props): ReactElement => {
  const [field, meta, helpers] = useField(props);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label?.toUpperCase()}</label>
      <Select
        clearable
        options={props.options}
        value={field.value || null}
        onChange={(e, value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={props.placeholder}
      />
      {meta.touched && meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};
