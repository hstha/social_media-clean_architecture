import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Segment, Form as UIForm, Header } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { useHistory, useParams } from 'react-router';
import { useStore } from '../../../core/stores/store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MyDate, MyInput, MyTextArea } from '../../../core/common/form';
import { observer } from 'mobx-react-lite';
import { ActivityFormValues } from '../../../core/interface';
import { toast } from 'react-toastify';
import { AppConstant } from '../../../appConstant';

const validationSchema = Yup.object({
  title: Yup.string().required('The activity title is required'),
  description: Yup.string().required('The activity description is required'),
  category: Yup.string().required('The activity category is required'),
  city: Yup.string().required('The activity city is required'),
  venue: Yup.string().required('The activity venue is required'),
  date: Yup.string().required('The activity date is required'),
});

const ActivityForm = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const {
    activityStore: {
      loadActivity,
      isDeletingActivity,
      saveActivity,
      deleteActivity,
      updateActivity,
    },
  } = useStore();

  const [activity, setActivity] = useState<ActivityFormValues>(
    new ActivityFormValues()
  );

  useEffect(() => {
    if (id) {
      loadActivity(id)
        .then((activity) => {
          setActivity(new ActivityFormValues(activity));
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const onRecordSave = (activity: ActivityFormValues) => {
    if (activity.id) {
      onUpdate(activity);
    } else {
      onSave(activity);
    }
  };

  const onSave = (activity: ActivityFormValues) => {
    const newActivity = { ...activity, id: uuid() };
    saveActivity(newActivity)
      .then((activity) => {
        if (activity) {
          toast.success(
            AppConstant.SUCCESS.ACTIVITY.CREATE.replace(
              '{activityTitle}',
              activity.title.toUpperCase()
            )
          );
        }
        history.push(`/activity/${newActivity.id}`);
      })
      .catch((err) => console.error(err));
  };

  const onDelete = (id: string) => {
    deleteActivity(id);
    history.push('/activities');
  };

  const onUpdate = (activity: ActivityFormValues) => {
    updateActivity(activity).then(() => {
      history.push(`/activity/${activity.id}`);
    });
  };

  const title = !activity.id ? 'Create Activity' : `Edit ${activity.title}`;

  return (
    <Segment clearing>
      <Header content={title} color='teal' />
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={activity}
        onSubmit={(values) => onRecordSave(values)}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <MyInput label='Title' placeholder='Title' name='title' />
            <MyTextArea
              label='Description'
              placeholder='Description'
              name='description'
              rows={5}
            />
            <UIForm.Group widths='equal'>
              <MyInput
                label='Category'
                placeholder='Category'
                name='category'
              />
              <MyInput label='City' placeholder='City' name='city' />
              <MyInput label='Venue' placeholder='Venue' name='venue' />
              <MyDate
                placeholderText='Date'
                name='date'
                showTimeSelect
                dateFormat='MMMM d, yyyy h:mm aa'
              />
            </UIForm.Group>
            <Button content='Cancel' positive />
            {activity.id && (
              <Button
                color='red'
                onClick={() => onDelete(activity.id!)}
                content='Delete'
                loading={isDeletingActivity}
              />
            )}
            <Button
              loading={isSubmitting}
              content='Save'
              labelPosition='right'
              icon='checkmark'
              type='submit'
              positive
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
