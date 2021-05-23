import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from './core/navbar/NavBar';
import './styles.css';
import { Route, Switch, useLocation } from 'react-router';
import HomePage from './features/home/HomePage';
import {
  ActivityDashboard,
  ActivityDetail,
  ActivityForm,
} from './features/activities';
import TestErrors from './features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from './features/errors/NotFound';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  const { key } = useLocation();
  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: '5em' }}>
              <Switch>
                <Route path='/activities' component={ActivityDashboard} />
                <Route path='/activity/:id' component={ActivityDetail} />
                <Route
                  key={key}
                  path={['/createactivity', '/manageactivity/:id']}
                  component={ActivityForm}
                />
                <Route path='/errors' component={TestErrors} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default App;
