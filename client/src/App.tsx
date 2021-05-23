import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from './core/navbar/NavBar';
import './styles.css';
import { Route, useLocation } from 'react-router';
import HomePage from './features/home/HomePage';
import { ActivityDashboard, ActivityDetail, ActivityForm } from './features/activities';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  const { key } = useLocation();
  return (
    <Fragment>
      <Route path='/' exact component={HomePage} />
      <Route 
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{marginTop: '5em'}}>
              <Route path='/activities' component={ActivityDashboard} />
              <Route path='/activity/:id'  component={ActivityDetail} />
              <Route key={key} path={['/createactivity', '/manageactivity/:id']}  component={ActivityForm} />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default App;
