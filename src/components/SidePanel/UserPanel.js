import React from "react";
import { Dropdown, Grid, Header, Icon } from "semantic-ui-react";

import firebase from "../../config/firebase";

const UserPanel = () => {
  const _dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>User</strong>
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
      text: <span onClick={_handleSignedOut}>Signed Out</span>,
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
              trigger={<span>User</span>}
              options={_dropdownOptions()}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
