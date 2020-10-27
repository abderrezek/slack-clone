import React from "react";
import { Button, Divider, Menu, Sidebar } from "semantic-ui-react";

const ColorPanel = () => {
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
      <Button icon="add" size="small" color="blue" />
    </Sidebar>
  );
};

export default ColorPanel;
