"use client";

import React, { useState } from "react";
import SelectRestModal from "../modals/SelectRest/SelectRestModal";
import { Restaurant } from "@/types/restaurant";
import { useRouter } from "next/navigation";

function HomeSearch() {
  const [searchStr, setSearchStr] = useState("");
  const [showSelectRest, setShowSelectRest] = useState(false);
  const router = useRouter();

  async function handleSearch() {
    console.log(`Searched string: "${searchStr}"`);
  }

  async function handleMarkerClick(rest: Restaurant) {
    router.push(`/restaurant?id=${rest.mapboxId}`);
  }

  return (
    <div className="bg-[#f2f2f2] px-10 pt-[60px] border-b-2 border-b-neutral-200 pb-5">
      <p className="pt-5 text-2xl">Find the best restaurants and food spots.</p>
      <div className="flex w-full xl:w-[50%] rounded-xl overflow-hidden mt-2">
        <input
          type="text"
          className="bg-white shadow-md outline-none p-3 w-full"
          placeholder="Search post, restaurant, user..."
          onChange={(e) => setSearchStr(e.target.value)}
        />
        <button
          className="bg-blue-300 hover:bg-blue-700 px-3 py-2 cursor-pointer text-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <button
        className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-xl cursor-pointer text-white block xl:hidden mt-5"
        onClick={() => setShowSelectRest((prev) => !prev)}
      >
        Select Restaurant
      </button>

      <SelectRestModal
        visible={showSelectRest}
        setVisibile={setShowSelectRest}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
}

export default HomeSearch;
