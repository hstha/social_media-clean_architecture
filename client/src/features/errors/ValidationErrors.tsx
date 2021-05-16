import React, { ReactElement } from 'react';
import { Container, Message } from 'semantic-ui-react';

interface Props {
  errors: any;
}

const ValidationErrors = ({ errors }: Props): ReactElement => {
  return (
    <Container>
      <Message error>
        {errors.map((err: any, i: any) => (
          <Message.Item key={i}>{err}</Message.Item>
        ))}
      </Message>
    </Container>
  );
};

export default ValidationErrors;
