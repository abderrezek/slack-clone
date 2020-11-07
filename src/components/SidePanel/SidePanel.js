import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

const SidePanel = ({ currentUser, primaryColor }) => {
  return (
    <Menu
      inverted
      vertical
      size="large"
      fixed="left"
      style={{ backgroundColor: primaryColor, fontSize: "1.2rem" }}
    >
      <UserPanel primaryColor={primaryColor} currentUser={currentUser} />
      <Starred currentUser={currentUser} />
      <Channels currentUser={currentUser} />
      <DirectMessages currentUser={currentUser} />
    </Menu>
  );
};

export default SidePanel;
