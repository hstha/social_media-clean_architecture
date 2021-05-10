import React, { ReactElement, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../core/interface';

interface Props {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  isActivityDeleting: boolean;
}

const ActivityList = (props: Props): ReactElement => {
  const {activities, onSelectActivity, onDeleteActivity, isActivityDeleting} = props;
  const [targetedBtn, setTargetedBtn] = useState('');

  const onDeletingTarget = (activityId: string) => {
    setTargetedBtn(activityId);
    onDeleteActivity(activityId);
  };

  return (
    <Segment>
      <Item.Group divided>
        {
          activities.map(activity => (
            <Item key={activity.id}>
              <Item.Content>
                <Item.Header as='a'>{activity.title}</Item.Header>
                <Item.Description>
                  <div>{activity.description}</div>
                  <div>{activity.city}, {activity.venue}</div>
                </Item.Description>
                <Item.Extra>
                  <Button 
                    floated='right' 
                    content='View' 
                    color='blue' 
                    onClick={() => onSelectActivity(activity)}
                  />
                  <Button
                    loading={isActivityDeleting && targetedBtn === activity.id}
                    floated='right' 
                    content='Delete' 
                    color='red' 
                    onClick={() => onDeletingTarget(activity.id)}
                  />
                  <Label basic content={activity.category} />
                </Item.Extra>
              </Item.Content>
            </Item>
          ))
        }
      </Item.Group>
    </Segment>
  );
};

export default ActivityList;