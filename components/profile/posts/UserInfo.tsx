"use client";

import SelectRestModal from "@/components/modals/SelectRest/SelectRestModal";
import { ReviewDocument } from "@/models/Review";
import { Restaurant } from "@/types/restaurant";
import { PopulatedReview } from "@/types/review";
import { UserStats } from "@/types/userstats";
import { getUserStatsById } from "@/utils/client/users";
import { User } from "@auth0/nextjs-auth0/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { ReadonlyURLSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function UserInfo(props: {
  user: User | null | undefined;
  isLoading: boolean;
  router: AppRouterInstance;
  rest: Restaurant | undefined;
  setRest: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
  searchParams: ReadonlyURLSearchParams;
  setPopReview: React.Dispatch<
    React.SetStateAction<PopulatedReview | undefined>
  >;
  setShowReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: ReviewDocument[];
}) {
  const {
    user,
    isLoading,
    router,
    rest,
    setRest,
    searchParams,
    setPopReview,
    setShowReviewModal,
    reviews,
  } = props;
  const [stats, setStats] = useState<UserStats | undefined>();
  const [showSelectRest, setShowSelectRest] = useState(false);

  async function refreshStats() {
    const res = await getUserStatsById(user!.sub);
    const rerr = res.anticipate();
    if (rerr.error) {
      console.log(rerr.message);
    } else {
      setStats(res.unwrap());
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      refreshStats();
    }
  }, [user, isLoading, router, reviews]);

  return (
    <div className="border-b border-neutral-200 py-6 bg-white px-5 lg:flex lg:justify-center">
      <div className="lg:w-[90%] xl:w-[80%] 2xl:w-[70%]">
        <div className="flex justify-between gap-6">
          {/* Profile Picture */}
          <div className="flex items-stretch">
            <Image
              src={user ? user.picture! : "/profile.png"}
              alt="profile pic"
              width={128}
              height={128}
              className="rounded-full object-contain w-18 h-18 md:w-24 md:h-24 my-auto"
            />

            {/* User Info */}
            <div className="pl-5 flex-col">
              <p className="md:text-2xl font-medium">
                {user ? user.name : "Loading..."}
              </p>
              <p className="text-gray-500 md:mt-3 text-sm/4! line-clamp-2 hidden md:block">
                {user && user.name !== user.email ? user.email : ""}
              </p>

              <div className="mt-4 flex flex-col lg:flex-row lg:gap-16 text-sm md:text-lg">
                <p>Reviews: {stats ? stats.numReviews : 0}</p>
                <p>Restaurant Visits: {stats ? stats.numRestaurants : 0}</p>
                <p>Collections: {stats ? stats.numCollections : 0}</p>
              </div>
            </div>
          </div>

          <div
            className={
              "flex flex-col gap-3 mt-auto " +
              (searchParams.get("restaurantId") === null
                ? "items-center"
                : "items-end")
            }
          >
            {searchParams.get("restaurantId") === null && (
              <div className="flex flex-col items-center">
                <button
                  className="mt-auto md:rounded-md bg-blue-300 hover:bg-blue-700 md:px-4 md:py-2 p-1 rounded-full text-white"
                  onClick={() => setShowSelectRest((prev) => !prev)}
                >
                  <p className="hidden md:block">Select Restaurant</p>
                  <Image
                    src="/svgs/world.svg"
                    width={32}
                    height={32}
                    alt="manage reviews"
                    className="block md:hidden opacity-50"
                  />
                </button>
              </div>
            )}

            <button
              className={
                "md:rounded-md md:px-4 md:py-2 text-white p-2 rounded-full " +
                (searchParams.get("restaurantId") || rest
                  ? "bg-blue-300 hover:bg-blue-700"
                  : "bg-blue-200 disabled")
              }
              onClick={() => {
                setPopReview(undefined);
                setShowReviewModal((prev) => !prev);
              }}
            >
              <p className="hidden md:block">Create Review</p>
              <Image
                src="/svgs/bplus.svg"
                width={24}
                height={24}
                alt="manage reviews"
                className="block md:hidden opacity-50"
              />
            </button>
          </div>
        </div>

        <p className="text-center mt-3 text-neutral-700 text-sm md:text-md">
          {rest && `Location: ${rest.name}`}
          {!searchParams.get("restaurantId") &&
            !rest &&
            "Select a restaurant to make a review!"}
        </p>
      </div>

      <SelectRestModal
        visible={showSelectRest}
        setVisibile={setShowSelectRest}
        onMarkerClick={async (rest) => {
          setRest(rest);
          setShowSelectRest(false);
        }}
      />
    </div>
  );
}

export default UserInfo;
