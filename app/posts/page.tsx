import Nav from "@/components/general/Nav";
import React from "react";
import PostsPage from "@/components/profile/posts/PostsPage";

function Posts() {
  return (
    <div className="h-screen flex flex-col">
      <PostsPage />

      {/* Navbar */}
      <Nav />
    </div>
  );
}

export default Posts;
