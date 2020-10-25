import React, { useState } from "react";
import { Dropdown, Grid, Header, Icon, Image } from "semantic-ui-react";

import firebase from "../../config/firebase";

const UserPanel = ({ currentUser }) => {
  const [user, setUser] = useState(currentUser);

  const _dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span>Signed Out</span>,
      onClick: _handleSignedOut,
    },
  ];

  const _handleSignedOut = (e) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Log Out");
      });
  };

  return (
    <Grid style={{ backgroundColor: "#4c3c4c" }}>
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
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={_dropdownOptions()}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
