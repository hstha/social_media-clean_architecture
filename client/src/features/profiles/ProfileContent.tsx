/* eslint-disable react/display-name */
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../core/interface';
import { useStore } from '../../core/stores/store';
import ProfileFollowing from './ProfileFollowing';
import ProfilePhotos from './ProfilePhotos';

interface Props {
  profile: Profile;
}

export default function ProfileContent({ profile }: Props): JSX.Element {
  const {
    profileStore: { setActiveTab },
  } = useStore();
  const panes = [
    { menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane> },
    {
      menuItem: 'Photos',
      render: () => <ProfilePhotos photos={profile.photos!} />,
    },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    {
      menuItem: 'Followers',
      render: () => <ProfileFollowing />,
    },
    {
      menuItem: 'Following',
      render: () => <ProfileFollowing />,
    },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(e, data) => setActiveTab(+data.activeIndex!)}
    />
  );
}
