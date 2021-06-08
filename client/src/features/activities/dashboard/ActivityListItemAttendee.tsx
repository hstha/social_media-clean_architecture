import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';
import { AppConstant } from '../../../appConstant';
import { Profile } from '../../../core/interface';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
  attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({
  attendees,
}: Props) {
  const { DEFAULT_LINKS } = AppConstant;
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.username}
          trigger={
            <List.Item as={Link} to={`/profiles/${attendee.username}`}>
              <Image
                size='mini'
                circular
                src={attendee.image || DEFAULT_LINKS.USER_IMAGE}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});
