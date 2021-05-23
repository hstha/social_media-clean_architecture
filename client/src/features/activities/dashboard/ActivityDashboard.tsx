import { observer } from 'mobx-react-lite';
import React, { ReactElement, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../core/loader/LoadingComponent';
import { useStore } from '../../../core/stores/store';
import ActivityFilter from './ActivitiesFilter';
import ActivityList from './ActivityList';

const ActivityDashboard = (): ReactElement => {
  const { activityStore } = useStore();

  useEffect(() => {
    if (activityStore.activityMap.size < 1) {
      activityStore.loadActivities();
    }
  }, []);

  if (activityStore.isLoadingActivity) {
    return <LoadingComponent content='Loading app' />;
  }

  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilter />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
