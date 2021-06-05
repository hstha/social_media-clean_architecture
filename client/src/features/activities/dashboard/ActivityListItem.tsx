import { format } from 'date-fns';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../core/interface';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props {
  activity: Activity;
}

const ActivityListItem = ({ activity }: Props): ReactElement => {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            style={{ textAlign: 'center' }}
            attached='top'
            color='red'
            content='Cancelled'
          />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              style={{ marginBottom: 3 }}
              size='tiny'
              circular
              src='/assets/images/user.png'
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activity/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted By {activity.host?.displayName}
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color='orange'>
                    You are hosting this activity
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color='green'>
                    You are going to this activity
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' />{' '}
          {activity.date && format(activity.date, 'dd MMM yyyy h:mm aa')}
          <Icon name='marker' /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activity/${activity.id}`}
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
