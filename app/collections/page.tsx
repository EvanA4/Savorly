"use client";

import Nav from "@/components/general/Nav";
import React from "react";
import CollectionList from "@/components/profile/collections/CollectionList";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

function Profile() {
  //query for this eventually
  const collections = [
    {
      Name: "Collection1",
      Restaurants: ["Restaurant1", "Restaurant2", "Restaurant3"],
    },
    {
      Name: "Collection2",
      Restaurants: ["Restaurant4", "Restaurant5", "Restaurant6"],
    },
    {
      Name: "Collection3",
      Restaurants: ["Restaurant7", "Restaurant8", "Restaurant9"],
    },
  ];
  const collection_list = [];
  for (let i = 0; i < collections.length; i++) {
    collection_list.push(
      <CollectionList
        name={collections[i].Name}
        restaurants={collections[i].Restaurants}
      />,
    );
  }
  return (
    <div className="h-full relative">
      <div className="pt-[60px] border-b-1 border-b-gray-300 flex items-center justify-between">
        <p className=" pl-4 py-4 text-2xl">Collections</p>
        {/* add collection edit modal here? */}
        <IconButton className="!mr-8">
          <AddIcon fontSize="large" />
        </IconButton>
      </div>
      <div className="pt-5 flex flex-col items-center justify-center gap-4 pb-[65px] md:pb-[0px]">
        {...collection_list}
      </div>

      {/* Bottom Navbar */}
      <Nav />
    </div>
  );
}

export default Profile;
