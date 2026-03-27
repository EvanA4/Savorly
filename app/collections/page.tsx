"use client";

import Nav from "@/components/general/Nav";
import React from "react";

import CollectionsPage from "@/components/profile/collections/CollectionsPage";

function Collections() {
  return (
    <div className="h-screen flex flex-col">
      <CollectionsPage />

      {/* Navbar */}
      <Nav />
    </div>
  );
}

export default Collections;
