import React from "react";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

const MessagesHeader = ({
  channelName,
  numUniqueUsers,
  handleSearchChange,
  searchLoading,
  searchValue,
  handleDeleteSearch,
  privateChannel,
}) => {
  return (
    <Segment clearing>
      <Header floated="left" fluid="true" as="h2" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {!privateChannel && <Icon name="star outline" color="black" />}
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      <Header floated="right">
        <Input
          loading={searchLoading}
          onChange={handleSearchChange}
          icon={
            searchValue === "" ? (
              <Icon name="search" />
            ) : (
              <Icon name="remove" link onClick={handleDeleteSearch} />
            )
          }
          value={searchValue}
          size="mini"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
