import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  Divider,
  Grid,
  Header,
  Item,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import { AppConstant } from '../../appConstant';
import { Profile } from '../../core/interface';
import FollowBtn from './FollowButton';

interface Props {
  profile: Profile;
}

const ProfileHeader = ({ profile }: Props): JSX.Element => {
  const { DEFAULT_LINKS } = AppConstant;
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.image || DEFAULT_LINKS.USER_IMAGE}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1' content={profile.displayName} />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label='Followers' value={profile.followersCount} />
            <Statistic label='Following' value={profile.followingCount} />
          </Statistic.Group>
          <Divider />
          <FollowBtn profile={profile} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
