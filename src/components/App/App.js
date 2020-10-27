import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import "./App.css";
import ColorPanel from "../ColorPanel/ColorPanel";
import SidePanel from "../SidePanel/SidePanel";
import Messages from "../Messages/Messages";
import MetaPanel from "../MetaPanel/MetaPanel";

const App = ({ currentUser, currentChannel }) => (
  <Grid columns="equal" className="App" style={{ backgroundColor: "#eee" }}>
    <ColorPanel />
    <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id}
        channel={currentChannel}
        user={currentUser}
      />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

const mapStateFromProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateFromProps, null)(App);
