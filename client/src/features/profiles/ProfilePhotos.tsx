import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { AppConstant } from '../../appConstant';
import PhotoUploadWidget from '../../core/common/imageUpload/PhotoUploadWidget';
import { Photo } from '../../core/interface';
import { useStore } from '../../core/stores/store';

interface Props {
  photos: Photo[];
}

export default observer(function ProfilePhotos({ photos }: Props): JSX.Element {
  const { DEFAULT_LINKS } = AppConstant;
  const {
    profileStore: {
      isCurrentUser,
      uploadPhoto,
      isUploading,
      isProfileLoading,
      setMainPhoto,
      deletePhoto,
    },
  } = useStore();
  const [isPhotoUpdateMode, setPhotoUpdateMode] = useState(false);
  const [target, setTarget] = useState('');

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setPhotoUpdateMode(false));
  };

  const handleSetMainPhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const handleDeletePhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon='image' content='Photos' />
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              content={isPhotoUpdateMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setPhotoUpdateMode(!isPhotoUpdateMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {isPhotoUpdateMode ? (
            <PhotoUploadWidget
              loading={isUploading}
              uploadPhoto={handlePhotoUpload}
            />
          ) : (
            <Card.Group itemsPerRow={3}>
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url || DEFAULT_LINKS.USER_IMAGE} />
                  {isCurrentUser && !photo.isMain && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color='green'
                        content='Main'
                        name={'main' + photo.id}
                        disabled={photo.isMain}
                        loading={
                          target === 'main' + photo.id && isProfileLoading
                        }
                        onClick={(e) => handleSetMainPhoto(photo, e)}
                      />
                      <Button
                        basic
                        color='red'
                        icon='trash'
                        name={photo.id}
                        loading={target === photo.id && isProfileLoading}
                        onClick={(e) => handleDeletePhoto(photo, e)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
