import React from "react";
// prettier-ignore
import { Accordion, Header, Icon, Segment, Image, List } from "semantic-ui-react";

class MetaPanel extends React.Component {
  state = {
    channel: this.props.currentChannel,
    privateChannel: this.props.isPrivateChannel,
    activeIndex: 0,
  };

  _setActiveIndex = (event, titleProps) => {
    let { index } = titleProps;
    let { activeIndex } = this.state;
    let newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  __formatCount = (num) =>
    num > 1 || num === 0 ? `${num} posts` : `${num} post`;

  _displayTopPosters = (posts) =>
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], index) => (
        <List.Item key={index}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{this.__formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  render() {
    const { activeIndex, privateChannel, channel } = this.state;
    const { userPosts } = this.props;

    if (privateChannel) return null;

    return (
      <Segment loading={!channel}>
        <Header as="h3" attached="top">
          About #{channel && channel.name}
        </Header>

        <Accordion styled attached="true">
          {/* Channel Details */}
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this._setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {channel && channel.details}
          </Accordion.Content>

          {/* Top Posts */}
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this._setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>{userPosts && this._displayTopPosters(userPosts)}</List>
          </Accordion.Content>

          {/* Created By */}
          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this._setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h3">
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
