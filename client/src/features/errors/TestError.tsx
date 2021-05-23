import React, { ReactElement, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { TestError } from '../../core/api';
import ServerError from './ServerError';
import ValidationErrors from './ValidationErrors';

const TestErrors = (): ReactElement => {
  const [errors, setErrors] =
    useState<string[] | { details: string; message: string } | undefined>();

  function handleNotFound() {
    TestError.handleNotFound().catch((err) => {
      setErrors(undefined);
      console.log(err.response);
    });
  }

  function handleBadRequest() {
    TestError.handleBadRequest().catch((err) => {
      setErrors(undefined);
      console.log(err.response);
    });
  }

  function handleServerError() {
    TestError.handleServerError().catch((err) => {
      setErrors({ message: err.message, details: err.stack });
      console.log(err);
    });
  }

  function handleUnauthorised() {
    TestError.handleUnauthorised().catch((err) => {
      setErrors(undefined);
      console.log(err.response);
    });
  }

  function handleBadGuid() {
    TestError.handleBadGuid().catch((err) => {
      setErrors(undefined);
      console.log(err.response);
    });
  }

  function handleValidationError() {
    TestError.handleValidationError().catch((err) => {
      setErrors(err);
      console.log(err);
    });
  }

  return (
    <>
      <Header as='h1' content='Test Error component' />
      <Segment>
        <Button.Group widths='7'>
          <Button onClick={handleNotFound} content='Not Found' basic primary />
          <Button
            onClick={handleBadRequest}
            content='Bad Request'
            basic
            primary
          />
          <Button
            onClick={handleValidationError}
            content='Validation Error'
            basic
            primary
          />
          <Button
            onClick={handleServerError}
            content='Server Error'
            basic
            primary
          />
          <Button
            onClick={handleUnauthorised}
            content='Unauthorised'
            basic
            primary
          />
          <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
        </Button.Group>
      </Segment>
      {Array.isArray(errors) && errors.length > 1 && (
        <ValidationErrors errors={errors} />
      )}
      {!Array.isArray(errors) && typeof errors === 'object' && (
        <ServerError message={errors.message} details={errors.details} />
      )}
    </>
  );
};

export default TestErrors;
