import React, { Fragment } from "react";
import Header from "../../_components/_common/Header";
import SearchFeed from "../../_components/SearchFeed";
import SearchForm from "../../_components/SearchForm";

const Search = () => {
  return (
    <Fragment>
      <Header showBorder={false} showBackArrow>
        <SearchForm />
      </Header>
      <SearchFeed />
    </Fragment>
  );
};

export default Search;
