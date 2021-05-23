import React, { ReactElement } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

export interface Props {
  message: string;
  details: string;
}

const ServerError = ({ details, message }: Props): ReactElement => {
  return (
    <Container>
      <Header as='h1' content='Server Error' />
      <Header sub as='h5' color='red' content={message} />
      {details && (
        <Segment>
          <Header as='h4' content='Stack trace' color='teal' />
          <code style={{ marginTop: '10px' }}>{details}</code>
        </Segment>
      )}
    </Container>
  );
};

export default ServerError;
