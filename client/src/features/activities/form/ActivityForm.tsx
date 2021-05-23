import React, { BaseSyntheticEvent, Fragment, ReactElement, useEffect, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Activity } from '../../../core/interface/Activity';
import {v4 as uuid} from 'uuid';
import { useHistory, useParams } from 'react-router';
import { useStore } from '../../../core/stores/store';

const INITIAL_ACTIVITY: Activity = {
  title: '',
  category: '',
  city: '',
  date: '',
  description: '',
  venue: '',
  id: ''
};

const ActivityForm = (): ReactElement => {
  const { id } = useParams<{id: string}>();
  const history = useHistory();
  const { activityStore } = useStore();
  const [isFormInRecordEditMode, setFormMode] = useState(false);

  const [activity, setActivity] = useState<Activity>(() => 
    id && activityStore.selectedActivity ? 
      activityStore.selectedActivity : 
      INITIAL_ACTIVITY
  );

  useEffect(() => {
    if(id) {
      setFormMode(true);
    } else {
      setFormMode(false);
    }
  }, [id]);

  const onChange = (e: BaseSyntheticEvent) => {
    const { name, value } = e.target;
    setActivity({...activity, [name]: value});
  };

  const onRecordSave = () => {
    if(isFormInRecordEditMode) {
      onUpdate();
    } else {
      onSave();
    }
  };

  const onSave = () => {
    const newActivity = {...activity, id: uuid()};
    activityStore.saveActivity(newActivity);
    history.push(`/activity/${newActivity.id}`);
  };

  const onDelete = () => {
    activityStore.deleteActivity(activity.id);
    history.push('/activities');
  };

  const onUpdate = () => {
    activityStore.updateActivity(activity);
    history.push(`/activity/${activity.id}`);
  };

  const title = !isFormInRecordEditMode ? 
    'Create Activity' : 
    `Edit ${activity.title} Activity`;
  
  return (
    <Fragment>
      <h1>{title}</h1>
      <Form>
        <Form.Input 
          label='Title' 
          placeholder='Title' 
          name='title' 
          value={activity.title}
          onChange={onChange}
        />
        <Form.TextArea 
          label='Description' 
          placeholder='Description' 
          name='description' 
          value={activity.description}
          onChange={onChange}
        />
        <Form.Group widths='equal'>
          <Form.Input 
            label='Category' 
            placeholder='Category' 
            name='category' 
            value={activity.category}
            onChange={onChange}
          />
          <Form.Input 
            label='City' 
            placeholder='City' 
            name='city' 
            value={activity.city}
            onChange={onChange}
          />
          <Form.Input 
            label='Venue' 
            placeholder='Venue' 
            name='venue' 
            value={activity.venue}
            onChange={onChange}
          />
          <Form.Input
            type='date'
            label='Date' 
            placeholder='Date' 
            name='date' 
            value={activity.date}
            onChange={onChange}
          />
        </Form.Group>
        <Button color='black' content="Cancel" />
        {
          isFormInRecordEditMode && 
          <Button color='red' onClick={onDelete} content="Delete"/>
        }
        <Button
          content='Save'
          labelPosition='right'
          icon='checkmark'
          onClick={onRecordSave}
          positive
        />
      </Form>
    </Fragment>
  );
};

export default ActivityForm;