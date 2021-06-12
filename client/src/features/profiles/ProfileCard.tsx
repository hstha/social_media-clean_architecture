import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { AppConstant } from '../../appConstant';
import { Profile } from '../../core/interface';
import FollowBtn from './FollowButton';

interface Props {
  profile: Profile;
}

const ProfileCard = ({ profile }: Props) => {
  const { DEFAULT_LINKS } = AppConstant;
  return (
    <Card>
      <Image src={profile.image || DEFAULT_LINKS.USER_IMAGE} />
      <Card.Content>
        <Card.Header as={Link} to={`/profiles/${profile.username}`}>
          {profile.displayName}
        </Card.Header>
        <Card.Description>Bio goes here</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name='user' />
        {profile.followersCount} followers
      </Card.Content>
      <FollowBtn profile={profile} />
    </Card>
  );
};

export default observer(ProfileCard);
