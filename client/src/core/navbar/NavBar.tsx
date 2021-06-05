import React, { ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export const NavBar = (): ReactElement => {
  const {
    userStore: { logout, user, isLoggedIn },
  } = useStore();
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} to='/' exact header>
          <img src='/assets/images/logo.png' alt='logo' />
          Activities
        </Menu.Item>
        <Menu.Item as={NavLink} to='/activities' name='Activities' />
        <Menu.Item as={NavLink} to='/errors' name='Errors' />
        <Menu.Item as={NavLink} to='/createactivity'>
          <Button positive content='Create Activity' />
        </Menu.Item>
        {isLoggedIn && (
          <Menu.Item position='right'>
            <Image
              src={user?.image || '/assets/images/user.png'}
              avatar
              spaced='right'
            />
            <Dropdown pointing='top left' text={user?.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user?.username}`}
                  text='My Profile'
                />
                <Dropdown.Item onClick={logout} text='Logout' icon='power' />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};
