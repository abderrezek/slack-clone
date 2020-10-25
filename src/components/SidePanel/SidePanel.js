import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";

const SidePanel = () => {
  return (
    <Menu
      inverted
      vertical
      size="large"
      fixed="left"
      style={{ backgroundColor: "#4c3c4c" }}
    >
      <UserPanel />
    </Menu>
  );
};

export default SidePanel;
