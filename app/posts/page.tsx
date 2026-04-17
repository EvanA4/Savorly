import Nav from "@/components/general/Nav";
import React, { Suspense } from "react";
import PostsPage from "@/components/profile/posts/PostsPage";

function Posts() {
  return (
    <div className="h-screen flex flex-col">
      <Suspense>
        <PostsPage />
      </Suspense>

      {/* Navbar */}
      <Nav />
    </div>
  );
}

export default Posts;
