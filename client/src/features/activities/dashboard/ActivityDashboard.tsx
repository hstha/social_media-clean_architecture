import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import agent from '../../../core/api/api';
import { clone } from '../../../core/helper';
import { Activity } from '../../../core/interface';
import LoadingComponent from '../../../core/loader/LoadingComponent';
import ActivityDetail from '../details/ActivityDetail';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

const ActivityDashboard = (): ReactElement => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [isFormVisible, setFormVisiblity] = useState(false);
  const [isFormInRecordEditMode, setFormMode] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    agent.Activities.list()
      .then(response => {
        const activities: Activity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
        });
        setActivities(activities);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if(selectedActivity) {
      const updatedActivity = activities.filter((activity) => activity.id === selectedActivity.id)[0];
      setSelectedActivity(updatedActivity);
    }
  }, [activities]);

  const onRecordDelete = (id: string, loadFullScreen?: boolean) => {
    if(loadFullScreen) {
      setLoading(true);
    } else {
      setButtonLoading(true);
    }

    agent.Activities.delete(id)
      .then(() => {  
        setActivities(activities.filter(activity => activity.id !== id));
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        if(loadFullScreen) {
          setLoading(false);
        } else {
          setButtonLoading(false);
        }
      });
  };

  const onRecordSave = (newActivity: Activity) => {
    setLoading(true);
    agent.Activities.create(newActivity)
      .then(() => {
        const activitiesCopy = clone(activities);
        activitiesCopy.push(newActivity);
        setActivities(activitiesCopy);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onRecordEdit = (updatedActivity: Activity) => {
    setLoading(true);
    agent.Activities.update(updatedActivity)
      .then(() => {
        const activitiesCopy = activities.map<Activity>((activity) => {
          if(activity.id === updatedActivity.id) {
            activity = updatedActivity;
          }
          return activity;
        });
        setActivities(activitiesCopy);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setEditFormMode = () => {
    setFormMode(true);
    setFormVisiblity(true);
  };

  const setCreateFormMode = () => {
    setFormMode(false);
    setFormVisiblity(true);
  };

  if(isLoading) {
    return(
      <LoadingComponent content='Loading app' />
    );
  }

  return (
    <Grid>
      <Grid.Column width='10'>
        <Button positive content="Create Activity" onClick={setCreateFormMode}/>
      </Grid.Column>
      <Grid.Column width='10'>
        <ActivityList 
          activities={activities} 
          onSelectActivity={setSelectedActivity}
          onDeleteActivity={onRecordDelete}
          isActivityDeleting={isButtonLoading}
        />
      </Grid.Column>
      <Grid.Column width='6'>
        {
          !isFormVisible && selectedActivity && 
            <ActivityDetail 
              activity={selectedActivity}
              onEdit={setEditFormMode}
            />
        }
      </Grid.Column>
      {
        isFormVisible && 
        <ActivityForm 
          isRecordEditMode= {isFormInRecordEditMode}
          selectedActivity={isFormInRecordEditMode ? selectedActivity : undefined}
          closeModal={() => setFormVisiblity(false)}
          onRecordEdit={onRecordEdit}
          onRecordDelete={onRecordDelete}
          onRecordSave={onRecordSave}
          isModalVisible={isFormVisible}
        />
      }
    </Grid>
  );
};

export default ActivityDashboard;