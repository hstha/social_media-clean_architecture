import React from 'react';
import { Button, Reveal } from 'semantic-ui-react';
import { Profile } from '../../core/interface';
import { useStore } from '../../core/stores/store';

interface Props {
  profile: Profile;
}

export default function FollowBtn({ profile }: Props): JSX.Element | null {
  const {
    profileStore: { updateFollowing, isProfileLoading },
    userStore,
  } = useStore();

  if (userStore.user?.username === profile.username) return null;

  return (
    <Reveal animated='move'>
      <Reveal.Content visible style={{ width: '100%' }}>
        <Button
          fluid
          color='teal'
          content={profile.isFollowing ? 'Following' : 'Not Following'}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: '100%' }}>
        <Button
          loading={isProfileLoading}
          basic
          fluid
          color={profile.isFollowing ? 'red' : 'green'}
          content={profile.isFollowing ? 'Unfollow' : 'Follow'}
          onClick={() =>
            updateFollowing(profile.username!, profile.isFollowing)
          }
        />
      </Reveal.Content>
    </Reveal>
  );
}
