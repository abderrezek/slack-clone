import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";

const SidePanel = ({ currentUser }) => {
  return (
    <Menu
      inverted
      vertical
      size="large"
      fixed="left"
      style={{ backgroundColor: "#4c3c4c" }}
    >
      <UserPanel currentUser={currentUser} />
      <Channels currentUser={currentUser} />
      <DirectMessages currentUser={currentUser} />
    </Menu>
  );
};

export default SidePanel;
