import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Grid } from 'semantic-ui-react';
import { AppConstant } from '../../appConstant';
import LoadingComponent from '../../core/loader/LoadingComponent';
import { useStore } from '../../core/stores/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const {
    profileStore: { isProfileLoading, loadProfile, profile, setActiveTab },
  } = useStore();

  useEffect(() => {
    loadProfile(username);
    return () => {
      setActiveTab(0);
    };
  }, [username]);

  if (isProfileLoading || !profile)
    return <LoadingComponent content={AppConstant.LOADING.PROFILE} />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile} />
        <ProfileContent profile={profile} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
