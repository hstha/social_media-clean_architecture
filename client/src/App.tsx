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
import { useStore } from './core/stores/store';
import ModalContainer from './core/modal/Modal';
import { observer } from 'mobx-react-lite';
import LoadingComponent from './core/loader/LoadingComponent';
import { AppConstant } from './appConstant';
import ProfilePage from './features/profiles/ProfilePage';
import PrivateRoute from './core/common/PrivateRoute/PrivateRoute';

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
    return <LoadingComponent content={AppConstant.LOADING.APP} />;

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
                <PrivateRoute
                  path='/activities'
                  component={ActivityDashboard}
                />
                <PrivateRoute path='/activity/:id' component={ActivityDetail} />
                <PrivateRoute
                  key={key}
                  path={['/createactivity', '/manageactivity/:id']}
                  component={ActivityForm}
                />
                <PrivateRoute
                  path='/profiles/:username'
                  component={ProfilePage}
                />
                <Route path='/errors' component={TestErrors} />
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
