import React, { ChangeEvent, DragEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { Header, Icon } from 'semantic-ui-react';
import { PhotoFileType } from '../../interface';

interface Props {
  setPhoto: (file: PhotoFileType | undefined) => void;
}

const dragAndDopStyle = {
  border: 'dashed 3px #eee',
  borderColor: '#eee',
  borderRadius: '5px',
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  textAlign: 'center' as 'center',
  minHeight: 200,
};

const dragAndDopActiveStyle = {
  borderColor: 'green',
};

export default function PhotoWidgetDropzone({ setPhoto }: Props): JSX.Element {
  const [isDragActive, setDragActive] = useState(false);

  const onDrop = (
    e: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>
  ) => {
    setDragActive(false);
    e.preventDefault();
    let files: FileList;
    // eslint-disable-next-line no-prototype-builtins
    if (e.hasOwnProperty('dataTransfer')) {
      files = fileHandlerForDragEvent(e as DragEvent<HTMLDivElement>);
    } else {
      files = fileHandlerForInput(e as ChangeEvent<HTMLInputElement>)!;
    }

    if (files[0]) {
      const file: PhotoFileType = {
        ...files[0],
        url: URL.createObjectURL(files[0]),
      };
      if (!files[0].type.includes('image')) {
        toast.error('Only image file is supported');
        return;
      }
      setPhoto(file);
    } else {
      setPhoto(undefined);
    }
  };

  const fileHandlerForDragEvent = (e: DragEvent<HTMLDivElement>) => {
    return e.dataTransfer.files;
  };

  const fileHandlerForInput = (e: ChangeEvent<HTMLInputElement>) => {
    return e.target.files;
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      className='drag-element'
      style={
        isDragActive
          ? { ...dragAndDopStyle, ...dragAndDopActiveStyle }
          : { ...dragAndDopStyle }
      }
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <Icon name='upload' size='huge' disabled={isDragActive ? true : false} />
      <Header
        content='Drop image here'
        disabled={isDragActive ? true : false}
      />
      {/* <input
        type='file'
        style={{ display: 'none' }}
        onChange={onDrop}
        height='100%'
        width='100%'
      /> */}
    </div>
  );
}
