import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react';
import { AppConstant } from '../../../appConstant';
import { Activity } from '../../../core/interface';
import { useStore } from '../../../core/stores/store';

//dimming the image
const activityImageStyle = {
  filter: 'brightness(30%)',
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};

interface Props {
  activity: Activity;
}

function ActivityDetailedHeader({ activity }: Props) {
  const {
    activityStore: { attendActivity, isLoading, cancelActivityToogle },
  } = useStore();
  const { DEFAULT_LINKS } = AppConstant;

  const onActivityAttend = async (id: string) => {
    try {
      await attendActivity(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        {activity.isCancelled && (
          <Label
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color='red'
            content='Cancelled'
          />
        )}
        <Image
          src={
            `/assets/images/categoryImages/${activity.category}.jpg` ||
            DEFAULT_LINKS.TASK_IMAGE
          }
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{activity.date && format(activity.date, 'dd MMM yyyy')}</p>
                <p>
                  Hosted by{' '}
                  <strong>
                    <Link to={`/profiles/${activity.host?.username}`}>
                      {activity.hostUsername?.toUpperCase()}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {activity.isHost ? (
          <>
            <Button
              color={activity.isCancelled ? 'green' : 'red'}
              floated='left'
              basic
              content={
                activity.isCancelled
                  ? 'Re-activate Activity'
                  : 'Cancel Activity'
              }
              onClick={() => cancelActivityToogle(activity.id)}
              loading={isLoading}
            />
            <Button
              disabled={activity.isCancelled}
              as={Link}
              to={`/manageactivity/${activity.id}`}
              color='orange'
              floated='right'
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button
            loading={isLoading}
            onClick={() => onActivityAttend(activity.id)}
          >
            Cancel attendance
          </Button>
        ) : (
          <Button
            disabled={activity.isCancelled}
            loading={isLoading}
            color='teal'
            onClick={() => onActivityAttend(activity.id)}
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
}

export default observer(ActivityDetailedHeader);
