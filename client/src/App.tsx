import ActivityDashboard from './features/activities/dashboard/ActivityDashboard';
import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from './core/navbar/NavBar';
import './styles.css';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '5em'}}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default App;
