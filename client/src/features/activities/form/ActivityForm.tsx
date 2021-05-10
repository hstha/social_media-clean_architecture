import React, { BaseSyntheticEvent, ReactElement, useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { ModalPopup } from '../../../core/modal/Modal';
import { Activity } from '../../../core/interface';
import {v4 as uuid} from 'uuid';

interface Props {
  selectedActivity?: Activity;
  closeModal: () => void;
  isRecordEditMode: boolean;
  onRecordEdit: (updatedActivity: Activity) => void;
  onRecordSave: (newActivity: Activity) => void;
  onRecordDelete: (id: string, loadFullScreen: boolean) => void;
  isModalVisible: boolean;
}

const INITIAL_ACTIVITY: Activity = {
  title: '',
  category: '',
  city: '',
  date: '',
  description: '',
  venue: '',
  id: ''
};

const ActivityForm = (props: Props): ReactElement => {
  const selectedActivity = props.selectedActivity;
  const [activity, setActivity] = useState<Activity>(() => 
    selectedActivity ?? INITIAL_ACTIVITY
  );

  const onChange = (e: BaseSyntheticEvent) => {
    const { name, value } = e.target;
    setActivity({...activity, [name]: value});
  };

  const onRecordSave = () => {
    if(props.isRecordEditMode) {
      onEdit();
    } else {
      onSave();
    }
    props.closeModal();
  };

  const onSave = () => {
    props.onRecordSave({...activity, id: uuid()});
    props.closeModal();
  };

  const onDelete = () => {
    props.onRecordDelete(activity.id, true);
    props.closeModal();
  };

  const onEdit = () => {
    props.onRecordEdit(activity);
    props.closeModal();
  };

  const title = !props.isRecordEditMode ? 
    'Create Activity' : 
    `Edit ${props.selectedActivity?.title} Activity`;
  
  return (
    <ModalPopup 
      isModalVisible={props.isModalVisible}
      closeModal={props.closeModal}
      title={title}
    >
      <Modal.Content>
        <Form>
          <Form.Input 
            label='Title' 
            placeholder='Title' 
            name='title' 
            value={activity?.title}
            onChange={onChange}
          />
          <Form.TextArea 
            label='Description' 
            placeholder='Description' 
            name='description' 
            value={activity?.description}
            onChange={onChange}
          />
          <Form.Group widths='equal'>
            <Form.Input 
              label='Category' 
              placeholder='Category' 
              name='category' 
              value={activity?.category}
              onChange={onChange}
            />
            <Form.Input 
              label='City' 
              placeholder='City' 
              name='city' 
              value={activity?.city}
              onChange={onChange}
            />
            <Form.Input 
              label='Venue' 
              placeholder='Venue' 
              name='venue' 
              value={activity?.venue}
              onChange={onChange}
            />
            <Form.Input
              type='date'
              label='Date' 
              placeholder='Date' 
              name='date' 
              value={activity?.date}
              onChange={onChange}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button 
          color='black' 
          onClick={() => props.closeModal()}
          content="Close"
        />
        <Button 
          color='red' 
          onClick={onDelete}
          content="Delete"
        />
        <Button
          content={'Save'}
          labelPosition='right'
          icon='checkmark'
          onClick={onRecordSave}
          positive
        />
      </Modal.Actions>
    </ModalPopup>
  );
};

export default ActivityForm;