import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Grid } from 'semantic-ui-react';
import { AppConstant } from '../../../appConstant';
import LoadingComponent from '../../../core/loader/LoadingComponent';
import { useStore } from '../../../core/stores/store';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ActivityDetail = () => {
  const {
    activityStore: {
      selectedActivity,
      loadActivity,
      isActivitiesLoading,
      clearSelectedActivity,
    },
  } = useStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }

    return () => clearSelectedActivity();
  }, [id, loadActivity, clearSelectedActivity]);

  if (isActivitiesLoading || !selectedActivity) {
    return <LoadingComponent content={AppConstant.LOADING.ACTIVITY} />;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={selectedActivity!} />
        <ActivityDetailedInfo activity={selectedActivity!} />
        <ActivityDetailedChat activityId={selectedActivity.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={selectedActivity!} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetail);
