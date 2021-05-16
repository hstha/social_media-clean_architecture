import { observer } from 'mobx-react-lite';
import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStore } from '../stores/store';

const ModalContainer = (): JSX.Element => {
  const {
    modalStore: { modal, closeModal },
  } = useStore();
  return (
    <Modal onClose={closeModal} open={modal.isOpen} size='mini'>
      <i
        aria-hidden='true'
        onClick={closeModal}
        className='close disabled icon'
      ></i>
      <Modal.Header>{modal.title}</Modal.Header>
      <Modal.Content>{modal.body}</Modal.Content>
    </Modal>
  );
};

export default observer(ModalContainer);
