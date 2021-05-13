import React, { ReactElement } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { Activity } from '../../../core/interface';

interface Props {
  activity: Activity;
  onEdit: () => void;
}

const ActivityDetail = ({activity, onEdit}: Props): ReactElement => {
  return(
    <Card>
      <Image src={`/assets/images/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span className='date'>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button 
            basic 
            color='blue' 
            content='Edit'
            onClick={() => onEdit()} 
          />
          <Button basic color='grey' content='Cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ActivityDetail;