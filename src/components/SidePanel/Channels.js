import React, { useState } from "react";
import { Button, Form, Icon, Input, Menu, Modal } from "semantic-ui-react";

import firebase from "../../config/firebase";

const Channels = ({ currentUser }) => {
  const [channels, setChannels] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({
    channelName: "",
    channelDetail: "",
  });
  const [channelsRef, setChannelsRef] = useState(
    firebase.database().ref("channels")
  );

  const _closeModal = (e) => setOpen(false);
  const _openModal = (e) => setOpen(true);

  const _handleChange = (e) =>
    setInputs((state) => ({ ...state, [e.target.name]: e.target.value }));

  const _handleSubmit = (e) => {
    e.preventDefault();
    if (__isFormValid(inputs)) {
      __addChannel();
    }
  };

  const __addChannel = () => {
    let key = channelsRef.push().key;
    let newChannel = {
      id: key,
      name: inputs.channelName,
      details: inputs.channelDetail,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setInputs({ channelName: "", channelDetail: "" });
        _closeModal();
      })
      .catch((err) => console.error(err));
  };

  const __isFormValid = ({ channelName, channelDetail }) =>
    channelName && channelDetail;

  return (
    <>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}) <Icon name="add" onClick={_openModal} />
        </Menu.Item>
      </Menu.Menu>

      {/* Add Channel Modal */}
      <Modal basic open={open} onClose={_closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={_handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label="Name of Channel"
                name="channelName"
                onChange={_handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the Channel"
                name="channelDetail"
                onChange={_handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={_handleSubmit} inverted>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" onClick={_closeModal} inverted>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Channels;
