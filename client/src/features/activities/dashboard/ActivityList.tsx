import { observer } from 'mobx-react-lite';
import React, { Fragment, ReactElement } from 'react';
import { Header } from 'semantic-ui-react';
import { useStore } from '../../../core/stores/store';
import ActivityListItem from './ActivityListItem';

const ActivityList = (): ReactElement => {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;
  return (
    <>
      {groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color='teal'>
            {group}
          </Header>
          {activities.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default observer(ActivityList);
