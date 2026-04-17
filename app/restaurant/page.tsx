import Nav from "@/components/general/Nav";
import RestPage from "@/components/rest/RestPage";
import React, { Suspense } from "react";

function Profile() {
  return (
    <div className="h-full relative">
      <Suspense>
        <RestPage />
      </Suspense>
      <Nav />
    </div>
  );
}

export default Profile;
