import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import { useStore } from '../../core/stores/store';
import LoginForm from '../authorization/LoginForm';
import RegisterForm from '../authorization/RegisterForm';

const HomePage = (): JSX.Element => {
  const { userStore, modalStore } = useStore();
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
        {userStore.isLoggedIn ? (
          <>
            <Header as='h2' inverted content='Welcome to Activities' />
            <Button as={Link} to='/activities' size='huge' inverted>
              Go to Activities.
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() =>
                modalStore.openModal(<LoginForm />, 'Login to Activities')
              }
              size='huge'
              inverted
              content='Login!'
            />
            <Button
              onClick={() =>
                modalStore.openModal(<RegisterForm />, 'Register to Activities')
              }
              size='huge'
              inverted
              content='Register!'
            />
          </>
        )}
      </Container>
    </Segment>
  );
};

export default HomePage;
