import React, { useEffect, useRef, useState } from "react";
// prettier-ignore
import { Button, Dropdown, Grid, Header, Icon, Image, Input, Modal, } from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";

import firebase from "../../config/firebase";

const UserPanel = ({ currentUser, primaryColor }) => {
  /* eslint-disable no-unused-vars */
  const [user, setUser] = useState(currentUser);
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [blob, setBlob] = useState("");
  let avatarEditor = useRef(null);
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState("");
  const [storageRef, setStorageRef] = useState(firebase.storage().ref());
  const [userRef, setUserRef] = useState(firebase.auth().currentUser);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));
  const [metaData, setMetaData] = useState({ contentType: "image/jpeg" });

  const _dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user && user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
      onClick: () => _toggleModal(true),
    },
    {
      key: "signout",
      text: <span>Signed Out</span>,
      onClick: _handleSignedOut,
    },
  ];

  const _toggleModal = (show) => setModal(show);

  const _handleSignedOut = (e) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Log Out");
      });
  };

  const _handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        setPreviewImage(reader.result);
      });
    }
  };

  const _handleCropImage = () => {
    if (avatarEditor) {
      avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl);
        setBlob(blob);
      });
    }
  };

  const _uploadCroppedImage = () => {
    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metaData)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURL) => {
          setUploadedCroppedImage(downloadURL);
        });
      });
  };

  useEffect(() => {
    if (uploadedCroppedImage !== "") {
      userRef
        .updateProfile({
          photoURL: uploadedCroppedImage,
        })
        .then(() => {
          console.log("PhotoURL Updated");
          _toggleModal(false);
        })
        .catch((err) => {
          console.error(err);
        });

      usersRef
        .child(user.uid)
        .update({
          avatar: uploadedCroppedImage,
        })
        .then(() => {
          console.log("User Avatar updated");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [uploadedCroppedImage]);

  return (
    <Grid style={{ backgroundColor: primaryColor }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>

          {/* User Dropdown */}
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user && user.photoURL} spaced="right" avatar />
                  {user && user.displayName}
                </span>
              }
              options={_dropdownOptions()}
            />
          </Header>
        </Grid.Row>

        {/* Change User Avatar Modal */}
        <Modal basic open={modal} onClose={() => _toggleModal(false)}>
          <Modal.Header>Change Avatar</Modal.Header>

          <Modal.Content>
            <Input
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
              onChange={_handleChange}
            />

            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {/* Image Preview */}
                  {previewImage && (
                    <AvatarEditor
                      ref={(node) => (avatarEditor = node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {/* Cropped Image Preview */}
                  {croppedImage && (
                    <Image
                      style={{ margin: "3.5em auto" }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>

          <Modal.Actions>
            {croppedImage && (
              <Button color="green" inverted onClick={_uploadCroppedImage}>
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            <Button color="green" inverted onClick={_handleCropImage}>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={() => _toggleModal(false)}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
