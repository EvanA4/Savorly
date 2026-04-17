"use client";

import { ReviewDocument } from "@/models/Review";
import {
  getReviewsBySearchStr,
  getReviewsByUserId,
} from "@/utils/client/review";
import { User } from "@auth0/nextjs-auth0/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import React, { useState } from "react";

function PostSearch(props: {
  setReviews: React.Dispatch<React.SetStateAction<ReviewDocument[]>>;
  user: User | null | undefined;
  searchParams: ReadonlyURLSearchParams;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchStr, setSearchStr] = useState("");

  async function refreshPosts() {
    const spget = props.searchParams.get("restaurantId");
    const res = await getReviewsByUserId(
      props.user!.sub,
      spget ? spget! : undefined,
    );
    const rerr = res.anticipate();
    if (rerr.error) {
      console.log(rerr.message);
    } else {
      const tmpPosts = res.unwrap();
      props.setReviews(tmpPosts);
    }
  }

  async function handleSearch() {
    if (props.user) {
      props.setIsSearching(true);
      props.setReviews([]);
      if (!searchStr) refreshPosts();
      else {
        const spget = props.searchParams.get("restaurantId");
        const reviewsRes = await getReviewsBySearchStr(
          searchStr,
          spget ? spget : undefined,
          props.user.sub,
        );
        const rerr = reviewsRes.anticipate();
        if (rerr.error) {
          console.log(`Error: failed to get reviews: ${rerr.message}`);
        } else {
          props.setReviews(reviewsRes.unwrap());
        }
      }
      props.setIsSearching(false);
    }
  }

  return (
    <div className="bg-[#f2f2f2] px-10 pt-15 border-b-2 border-b-neutral-200 pb-5">
      <p className="pt-5 text-2xl">Find posts or restaurants</p>
      <div className="flex w-full rounded-xl overflow-hidden mt-2">
        <input
          type="text"
          className="bg-white shadow-md outline-none p-3 w-full "
          placeholder="Search posts"
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
    </div>
  );
}

export default PostSearch;
