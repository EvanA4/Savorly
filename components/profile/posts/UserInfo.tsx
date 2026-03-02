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
    <div className="flex items-center justify-center gap-6 border-b border-neutral-200 py-6 bg-white">
      {/* Profile Picture */}
      <div className="flex items-end justify-center">
        <div className="relative h-24 w-24 flex-none">
          <Image
            src={user ? user.picture! : "/profile.png"}
            alt="profile pic"
            width={128}
            height={128}
            className="rounded-full object-contain"
          />
        </div>

        {/* User Info */}
        <div className="pl-5 flex-1 min-w-0">
          <p className="text-2xl font-medium">
            {user ? user.given_name : "Loading..."}
          </p>
          <p className="text-gray-500 mt-3 text-sm/4! line-clamp-2">
            {user ? user.email : ""}
          </p>

          <div className="mt-4 flex items-center">
            <div className="flex gap-16">
              <p>Reviews: {stats ? stats.numReviews : 0}</p>
              <p>Restaurant Visits: {stats ? stats.numRestaurants : 0}</p>
              <p>Collections: {stats ? stats.numCollections : 0}</p>
            </div>
          </div>
        </div>

        <div
          className={
            "flex flex-col pl-50 gap-3 " +
            (searchParams.get("restaurantId") === null
              ? "items-center"
              : "items-end")
          }
        >
          {searchParams.get("restaurantId") === null && (
            <div className="flex flex-col items-center">
              <button
                className="mt-auto rounded-md bg-blue-300 hover:bg-blue-700 px-4 py-2 text-white"
                onClick={() => setShowSelectRest((prev) => !prev)}
              >
                Select Restaurant
              </button>

              {rest && (
                <p className="text-center w-fit text-neutral-700">
                  Location: {rest.name}
                </p>
              )}
            </div>
          )}

          <button
            className={
              "rounded-md px-4 py-2 text-white " +
              (searchParams.get("restaurantId") || rest
                ? "bg-blue-300 hover:bg-blue-700"
                : "bg-blue-200 disabled")
            }
            onClick={() => {
              setPopReview(undefined);
              setShowReviewModal((prev) => !prev);
            }}
          >
            Create Review
          </button>
        </div>
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
