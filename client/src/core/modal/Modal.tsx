import React, { ReactElement, ReactNode } from 'react';
import { Modal } from 'semantic-ui-react';

interface Props {
  isModalVisible: boolean;
  closeModal: () => void;
  title: string;
  children?: ReactNode;
}

export const ModalPopup = (props: Props): ReactElement => {

  return (
    <Modal
      onClose={() => props.closeModal()}
      open={props.isModalVisible}
    >
      <Modal.Header>{props.title}</Modal.Header>
      {
        props.children
      }
    </Modal>
  );
};
