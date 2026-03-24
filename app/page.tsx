"use client";

import HomeSearch from "@/components/forms/HomeSearch";
import StickyRestSelect from "@/components/forms/StickyRestSelect";
import Nav from "@/components/general/Nav";
import LandingReviews from "@/components/rest/LandingReviews";
import { ReviewDocument } from "@/models/Review";
import { useState } from "react";

export default function Home() {
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);

  return (
    <div className="min-h-full relative flex flex-col gap-5 md:gap-10">
      {/* User's search parameters */}
      <HomeSearch setReviews={setReviews} />

      {/* Restaurants display */}
      <div className="xl:grid grid-cols-3 2xl:grid-cols-7 pb-15">
        <div className="col-span-2 2xl:col-span-5">
          <p className="pl-15 mb-3 md:mb-5 text-2xl md:text-3xl">
            Popular Restaurants
          </p>
          <div className="flex xl:flex-wrap gap-5 overflow-x-scroll scrollbar-none pb-3 px-10">
            {/* {...rests} */}
            <LandingReviews reviews={reviews} setReviews={setReviews} />
          </div>
        </div>

        <div className="hidden xl:block w-full h-full 2xl:col-span-2 relative">
          <StickyRestSelect />
        </div>
      </div>

      {/* Navbar */}
      <Nav />
    </div>
  );
}
