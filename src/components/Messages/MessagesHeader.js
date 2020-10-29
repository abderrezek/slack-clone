import React from "react";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

const MessagesHeader = ({ channelName, numUniqueUsers }) => {
  return (
    <Segment clearing>
      <Header floated="left" fluid="true" as="h2" style={{ marginBottom: 0 }}>
        <span>
          {channelName} <Icon name="star outline" color="black" />
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      <Header floated="right">
        <Input
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
