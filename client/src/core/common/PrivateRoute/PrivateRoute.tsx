/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router';
import React from 'react';
import { useStore } from '../../stores/store';

interface Props extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

export default function PrivateRoute({
  component: Component,
  ...rest
}: Props): JSX.Element {
  const {
    userStore: { isLoggedIn },
  } = useStore();
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
}
