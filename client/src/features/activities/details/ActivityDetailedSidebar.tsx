import React from 'react';
import { Segment, List, Label, Item, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Activity } from '../../../core/interface';
import { AppConstant } from '../../../appConstant';

interface Props {
  activity: Activity;
}

const ActivityDetailedSidebar = ({ activity: { attendees, host } }: Props) => {
  if (!attendees?.length || !host) return null;
  const { DEFAULT_LINKS } = AppConstant;

  return (
    <>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {attendees.length} {attendees.length ? 'Person' : 'People'}
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map((attendee) => (
            <Item key={attendee.username} style={{ position: 'relative' }}>
              {attendee.username === host.username && (
                <Label
                  style={{ position: 'absolute' }}
                  color='orange'
                  ribbon='right'
                >
                  Host
                </Label>
              )}
              <Image
                size='tiny'
                src={attendee.image || DEFAULT_LINKS.USER_IMAGE}
              />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <Link to={`/profiles/${attendee.username}`}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
                <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </>
  );
};

export default observer(ActivityDetailedSidebar);
