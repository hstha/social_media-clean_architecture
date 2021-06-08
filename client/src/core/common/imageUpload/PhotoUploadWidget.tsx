import { Button, Grid, Header } from 'semantic-ui-react';
import React, { Fragment, useEffect, useState } from 'react';
import { AppConstant } from '../../../appConstant';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import { PhotoFileType } from '../../interface';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({
  loading,
  uploadPhoto,
}: Props): JSX.Element {
  const { PHOTO_UPLOAD_STEPS } = AppConstant;
  const [photo, setPhoto] = useState<PhotoFileType | undefined>(undefined);
  const [cropper, setCropper] = useState<Cropper>();

  const onCrop = () => {
    cropper!.getCroppedCanvas().toBlob((blob) => uploadPhoto!(blob!));
  };

  useEffect(() => {
    return () => {
      if (photo && photo.url) {
        URL.revokeObjectURL(photo.url);
      }
    };
  });

  return (
    <Grid>
      <Grid.Row>
        {PHOTO_UPLOAD_STEPS.map((step, index) => (
          <Fragment key={step + index}>
            <Grid.Column width={4}>
              <Header
                sub
                color='teal'
                content={`Step ${index + 1} - ${step}`}
              />
            </Grid.Column>
            <Grid.Column width={1} />
          </Fragment>
        ))}
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <PhotoWidgetDropzone setPhoto={setPhoto} />
          <Grid.Column width={1} />
        </Grid.Column>
        {photo && photo.url && (
          <>
            <Grid.Column width={4}>
              <PhotoWidgetCropper
                setCropper={setCropper}
                imagePreview={photo.url}
              />
            </Grid.Column>
            <Grid.Column width={1} />
          </>
        )}
        {photo && photo.url && (
          <>
            <Grid.Column width={4}>
              <>
                <div
                  className='img-preview'
                  style={{ minHeight: 200, overflow: 'hidden' }}
                />
                <Button.Group widths={2}>
                  <Button
                    loading={loading}
                    onClick={onCrop}
                    positive
                    icon='check'
                  />
                  <Button
                    disabled={loading}
                    onClick={() => setPhoto(undefined)}
                    icon='close'
                  />
                </Button.Group>
              </>
            </Grid.Column>
            <Grid.Column width={1} />
          </>
        )}
      </Grid.Row>
    </Grid>
  );
}
