import React, { useState } from "react";
import { Icon, Menu } from "semantic-ui-react";

const DirectMessages = () => {
  const [users, setUsers] = useState([]);

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <pan>
          <Icon name="mail" /> DIRECT MESSAGES
        </pan>{" "}
        ({users.length})
      </Menu.Item>
    </Menu.Menu>
  );
};

export default DirectMessages;
