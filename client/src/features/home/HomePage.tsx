import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';

const HomePage = (): JSX.Element => {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/images/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Activities.
        </Header>
        <Header as='h2' inverted content='Welcome to Activities' />
        <Button as={Link} to='/activities' size='huge' inverted>
          Go to Activities.
        </Button>
      </Container>
    </Segment>
  );
};

export default HomePage;
