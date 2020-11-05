import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";

import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../redux/actions/channelActions";

class Starred extends React.Component {
  state = {
    activeChannel: "",
    starredChannels: [],
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
