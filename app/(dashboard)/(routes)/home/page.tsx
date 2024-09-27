import React, { Fragment } from "react";
import PostForm from "../../_components/_common/PostForm";
import PostFeed from "../../_components/PostFeed";
import Header from "../../_components/_common/Header";

const Home = () => {
  return (
    <Fragment>
      <Header label="Home" />
      <PostForm placeholder="What is happening?!" />
      <PostFeed />
    </Fragment>
  );
};

export default Home;
