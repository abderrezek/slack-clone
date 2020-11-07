import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Icon,
  Label,
  Menu,
  Modal,
  Segment,
  Sidebar,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import { connect } from "react-redux";

import firebase from "../../config/firebase";
import { setColors } from "../../redux/actions/colorAction";

const ColorPanel = ({ currentUser, setColors }) => {
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));
  const [modal, setModal] = useState(false);
  const [userColors, setUserColors] = useState([]);
  const [colorsState, setColorsState] = useState({
    primary: "",
    secondary: "",
  });

  useEffect(() => {
    if (currentUser) {
      let userColors = [];
      usersRef
        .child(`${currentUser.uid}/colors`)
        .once("value", (snap) => {
          snap.forEach((colors) => {
            userColors.unshift(colors.val());
          });
        })
        .then(() => {
          setUserColors(userColors);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userColors]);

  const _openModal = () => setModal(true);

  const _closeModal = () => setModal(false);

  const _handleChangePrimary = (color) =>
    setColorsState((state) => ({ ...state, primary: color.hex }));

  const _handleChangeSecondary = (color) =>
    setColorsState((state) => ({ ...state, secondary: color.hex }));

  const _handleSaveColors = () => {
    if (colorsState.primary && colorsState.secondary) {
      __saveColors(colorsState);
    }
  };

  const __saveColors = ({ primary, secondary }) => {
    usersRef
      .child(`${currentUser.uid}/colors`)
      .push()
      .update({
        primary,
        secondary,
      })
      .then(() => {
        _closeModal();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const _displayUserColors = (colors) =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div className="color__container" onClick={() => setColors(color)}>
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            ></div>
          </div>
        </div>
      </React.Fragment>
    ));

  return (
    <Sidebar
      as={Menu}
      width="very thin"
      icon="labeled"
      inverted
      vertical
      visible
    >
      <Divider />
      <Button icon="add" size="small" color="blue" onClick={_openModal} />
      {_displayUserColors(userColors)}

      {/* Color Picker Modal */}
      <Modal basic open={modal} onClose={_closeModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary Color" />
            <SliderPicker
              color={colorsState.primary}
              onChange={_handleChangePrimary}
            />
          </Segment>

          <Segment inverted>
            <Label content="Secondary Color" />
            <SliderPicker
              color={colorsState.secondary}
              onChange={_handleChangeSecondary}
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={_handleSaveColors}>
            <Icon name="checkmark" /> Save Color
          </Button>
          <Button color="red" inverted onClick={_closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

export default connect(null, { setColors })(ColorPanel);
