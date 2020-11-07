import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";

//prettier-ignore
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions/channelActions";
import firebase from "../../config/firebase";

class Starred extends React.Component {
  state = {
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    activeChannel: "",
    starredChannels: [],
  };

  componentDidMount() {
    if (this.state.user) {
      this.__addListeners(this.state.user.uid);
    }
  }

  __addListeners = (userId) => {
    // For Starred Channel
    this.state.usersRef
      .child(userId)
      .child("starred")
      .on("child_added", (snap) => {
        let starredChannel = { id: snap.key, ...snap.val() };
        this.setState({
          starredChannels: [...this.state.starredChannels, starredChannel],
        });
      });

    // For UnStarred Channel
    this.state.usersRef
      .child(userId)
      .child("starred")
      .on("child_removed", (snap) => {
        let channelToRemove = { id: snap.key, ...snap.val() };
        let filteredChannels = this.state.starredChannels.filter((channel) => {
          return channel.id !== channelToRemove.id;
        });
        this.setState({
          starredChannels: filteredChannels,
        });
      });
  };

  __changeChannel = (channel) => {
    this.__setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  __setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  _displayChannels = (starredChannels) =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.__changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    const { starredChannels } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" /> STARRED
          </span>{" "}
          ({starredChannels.length})
        </Menu.Item>
        {this._displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
