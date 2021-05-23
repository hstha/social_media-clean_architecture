import React, { ReactElement } from 'react';
import { Container, Header, Message } from 'semantic-ui-react';

interface Props {
  errors: string[];
}

const ValidationErrors = ({ errors }: Props): ReactElement => {
  return (
    <Container>
      <Header as='h1' content='Validation Error' color='teal' />
      <Message error>
        {errors.map((err, i) => (
          <Message.Item key={i}>{err}</Message.Item>
        ))}
      </Message>
    </Container>
  );
};

export default ValidationErrors;
