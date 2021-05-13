import React, { ReactElement } from 'react';
import { Container, Menu } from 'semantic-ui-react';

export const NavBar = (): ReactElement => {
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img src='/assets/images/logo.png' alt='logo' />
          Activities
        </Menu.Item>
        <Menu.Item name="Activities" />
      </Container>
    </Menu>   
  );
};