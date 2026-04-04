"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import SelectRestModal from "../modals/SelectRest/SelectRestModal";
import { Restaurant } from "@/types/restaurant";
import { useRouter } from "next/navigation";
import { ReviewDocument } from "@/models/Review";
import { getReviewsBySearchStr } from "@/utils/client/review";
import { APIResult } from "@/types/results";

function HomeSearch(props: {
  setReviews: Dispatch<SetStateAction<ReviewDocument[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [searchStr, setSearchStr] = useState("");
  const [showSelectRest, setShowSelectRest] = useState(false);
  const router = useRouter();

  async function handleSearch() {
    props.setIsLoading(true);
    props.setReviews([]);
    if (!searchStr) {
      const rawRes = await fetch("/api/review");
      const apiRes = (await rawRes.json()) as APIResult<ReviewDocument[]>;
      if (apiRes.value) {
        props.setReviews(apiRes.value);
      }
    } else {
      const reviewsRes = await getReviewsBySearchStr(
        searchStr,
        undefined,
        undefined,
      );
      const rerr = reviewsRes.anticipate();
      if (rerr.error) {
        console.log(`Error: failed to get reviews: ${rerr.message}`);
      } else {
        props.setReviews(reviewsRes.unwrap());
      }
    }
    props.setIsLoading(false);
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
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSearch();
          }}
        />
        <button
          className="bg-blue-300 hover:bg-blue-700 px-3 py-2 cursor-pointer text-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <button
        className="bg-blue-300 hover:bg-blue-200 px-3 py-2 rounded-xl cursor-pointer text-white block xl:hidden mt-5"
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
