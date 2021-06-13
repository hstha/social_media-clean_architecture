import { observer } from 'mobx-react-lite';
import React, { ReactElement, useEffect } from 'react';
import { useState } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { PagingParams } from '../../../core/interface/pagination';
import { useStore } from '../../../core/stores/store';
import ActivityFilter from './ActivitiesFilter';
import ActivityList from './ActivityList';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

const ActivityDashboard = (): ReactElement => {
  const {
    activityStore: {
      isActivitiesLoading,
      loadActivities,
      activityMap,
      setPagingParams,
      pagination,
    },
  } = useStore();
  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    if (activityMap.size < 1) {
      loadActivities();
    }
  }, []);

  const handleGetNextActivities = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  };

  return (
    <Grid>
      <Grid.Column width='10'>
        {isActivitiesLoading && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <ActivityList />
        )}
        <Button
          floated='right'
          content='More'
          positive
          onClick={handleGetNextActivities}
          loading={loadingNext}
          disabled={pagination?.totalPages === pagination?.currentPage}
        />
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilter />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
