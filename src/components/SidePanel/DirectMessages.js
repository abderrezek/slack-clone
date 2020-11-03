import React, { useCallback, useEffect, useState } from "react";
import { Icon, Menu } from "semantic-ui-react";
import { useList } from "react-firebase-hooks/database";

import firebase from "../../config/firebase";

class DirectMessages extends React.Component {
  state = {
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
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

  render() {
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({this.state.users.length})
        </Menu.Item>
        {this.state.users.map((user) => (
          <Menu.Item
            key={user.uid}
            onClick={() => console.log(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
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

export default DirectMessages;
