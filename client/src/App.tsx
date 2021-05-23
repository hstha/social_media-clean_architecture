import React, { useEffect } from 'react';
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
import LoginForm from './features/authorization/LoginForm';
import { useStore } from './core/stores/store';
import ModalContainer from './core/modal/Modal';
import { observer } from 'mobx-react-lite';
import LoadingComponent from './core/loader/LoadingComponent';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  const { key } = useLocation();
  const { appStore, userStore } = useStore();

  useEffect(() => {
    if (appStore.token) {
      userStore.getCurrentUser().finally(() => appStore.setAppLoadded());
    } else {
      appStore.setAppLoadded();
    }
  }, [appStore, userStore]);

  if (!appStore.isAppLoaded)
    return <LoadingComponent content='Loading app...' />;

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
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
                <Route path='/login' component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
