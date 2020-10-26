import React, { useState } from "react";
import { Icon, Menu } from "semantic-ui-react";

const Channels = (props) => {
  const [channels, setChannels] = useState([]);

  return (
    <Menu.Menu style={{ paddingBottom: "2em" }}>
      <Menu.Item>
        <span>
          <Icon name="exchange" /> CHANNELS
        </span>{" "}
        ({channels.length}) <Icon name="add" />
      </Menu.Item>
    </Menu.Menu>
  );
};

export default Channels;
