import { observer } from 'mobx-react-lite';
import React from 'react';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../core/stores/store';
import ProfileCard from './ProfileCard';

export default observer(function ProfileFollowing() {
  const {
    profileStore: { profile, followings, isFollowingLoading, activeTab },
  } = useStore();

  return (
    <Tab.Pane loading={isFollowingLoading}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={`${profile?.displayName} ${
              activeTab === 3 ? 'Your Followers' : 'Your Following'
            }`}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings.map((profile) => (
              <ProfileCard key={profile.username} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
