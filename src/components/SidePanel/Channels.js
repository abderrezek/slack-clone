import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Icon, Input, Menu, Modal } from "semantic-ui-react";

import firebase from "../../config/firebase";

import { setCurrentChannel } from "../../redux/actions/channelActions";

const Channels = ({ currentUser, setCurrentChannel }) => {
  const [activeChannel, setActiveChannel] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [channels, setChannels] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({
    channelName: "",
    channelDetail: "",
  });
  /* eslint-disable no-unused-vars */
  const [channelsRef, setChannelsRef] = useState(
    firebase.database().ref("channels")
  );

  useEffect(() => {
    __addListeners();
  }, []);

  const __addListeners = () => {
    const loadedChannels = [];
    channelsRef
      .once("value", (snap) => {
        snap.forEach((channels) => {
          loadedChannels.push(channels.val());
        });
      })
      .then(() => {
        setChannels(loadedChannels);
      })
      .catch((err) => console.error("Problem with loading Channels"));
  };

  useEffect(() => {
    __setFirstChannel();
  }, [channels]);

  const __setFirstChannel = () => {
    if (firstLoad && channels.length > 0) {
      __changeChannel(channels[0]);
      setFirstLoad(false);
    }
  };

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
        __addListeners();
      })
      .catch((err) => console.error(err));
  };

  const __setActiveChannel = (channel) => setActiveChannel(channel.id);

  const __changeChannel = (channel) => {
    __setActiveChannel(channel);
    setCurrentChannel(channel);
  };

  const __isFormValid = ({ channelName, channelDetail }) =>
    channelName && channelDetail;

  const _displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => __changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  return (
    <>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}) <Icon name="add" onClick={_openModal} />
        </Menu.Item>

        {/* Channels */}
        {_displayChannels(channels)}
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

export default connect(null, { setCurrentChannel })(Channels);
