import React, { useState } from "react";
import { Icon, Menu } from "semantic-ui-react";

const DirectMessages = () => {
  /* eslint-disable no-unused-vars */
  const [users, setUsers] = useState([]);

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
    </Menu.Menu>
  );
};

export default DirectMessages;
