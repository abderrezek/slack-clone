import React from "react";
import { Icon, Menu } from "semantic-ui-react";
import { connect } from "react-redux";

import firebase from "../../config/firebase";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../redux/actions/channelActions";

class DirectMessages extends React.Component {
  state = {
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
    activeChannel: "",
  };

  componentDidMount() {
    if (this.state.user) {
      this.__addListeners(this.state.user.uid);
    }
  }

  __addListeners = (currentUserUid) => {
    const { usersRef, connectedRef, presenceRef } = this.state;
    let loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        let userAdded = snap.val();
        userAdded["uid"] = snap.key;
        userAdded["status"] = "offline";
        loadedUsers.push(userAdded);
        this.setState({ users: loadedUsers });
      }
    });

    connectedRef.on("value", (snap) => {
      if (snap.val()) {
        let ref = presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    presenceRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        this.__addStatusToUser(snap.key);
      }
    });
    presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.__addStatusToUser(snap.key, false);
      }
    });
  };

  __addStatusToUser = (userId, connected = true) => {
    let updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  _isUserOnline = (user) => user.status === "online";

  _changeChannel = (user) => {
    let channelId = this.__getChannelId(user.uid);
    let channelData = {
      id: channelId,
      name: user.name,
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.__setActiveChannel(user.uid);
  };

  __setActiveChannel = (userId) => {
    this.setState({ activeChannel: userId });
  };

  __getChannelId = (userId) => {
    let currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  render() {
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            onClick={() => this._changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
            active={user.uid === activeChannel}
          >
            <Icon
              name="circle"
              color={this._isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
