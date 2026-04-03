"use client";
import React, { useEffect, useRef, useState } from "react";
import StickyRestSelect from "../forms/StickyRestSelect";
import Image from "next/image";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ReviewCard from "./ReviewCard";
import Rating from "./Rating";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter, useSearchParams } from "next/navigation";
import { Restaurant, RestaurantStats } from "@/types/restaurant";
import {
  getRestaurantById,
  getRestaurantStatsById,
} from "@/utils/client/restaurant";
import Link from "next/link";

import {
  getBudgetStr,
  getPopulatedReview,
  getReviewsByRestaurantId,
} from "@/utils/client/review";
import { ReviewDocument } from "@/models/Review";
import { PopulatedReview } from "@/types/review";
import ReadReviewModal from "../modals/Review/ReadReviewModal";
import { MAPIUser } from "@/types/auth0/mapi_user";
import { getUserById } from "@/utils/client/users";
import AddToCollectionModal from "./AddToCollectionModal";
import CreateReviewModal from "../modals/Review/CreateReviewModal";

function RestPage() {
  const { user, isLoading } = useUser();
  const [rest, setRest] = useState<Restaurant>({
    name: "Loading...",
    mapboxId: "",
    phone: "...",
    website: "...",
    lat: -1,
    lng: -1,
  });
  const [restStats, setRestStats] = useState<RestaurantStats>({
    poiId: "",
    avgRating: 5,
    avgBudget: 3,
    reviewCount: 0,
    imageId: null,
  });
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selReview, setSelReview] = useState<PopulatedReview | undefined>(
    undefined,
  );
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [showRRM, setShowRRM] = useState<boolean>(false);
  const uidMap = useRef<Map<string, MAPIUser>>(new Map<string, MAPIUser>());
  const [showReviewModal, setShowReviewModal] = useState(false);

  async function fetchRest() {
    const restaurantRes = await getRestaurantById(searchParams.get("id")!);
    const rerr = restaurantRes.anticipate();

    if (rerr.error) {
      router.back();
    }

    setRest(restaurantRes.unwrap());
  }

  async function fetchRestStats() {
    const restStatsRes = await getRestaurantStatsById(searchParams.get("id")!);
    const rerr = restStatsRes.anticipate();

    if (rerr.error) {
      router.back();
    }

    setRestStats(restStatsRes.unwrap());
  }

  async function fetchReviews() {
    const restaurantRes = await getReviewsByRestaurantId(
      searchParams.get("id")!,
    );
    const rerr = restaurantRes.anticipate();

    if (rerr.error) {
      console.log(rerr.message);
    } else {
      const tmpReviews = restaurantRes.unwrap();
      for (let i = 0; i < tmpReviews.length; ++i) {
        if (!uidMap.current.has(tmpReviews[i].userId)) {
          const userRes = await getUserById(tmpReviews[i].userId);
          if (userRes) {
            uidMap.current.set(tmpReviews[i].userId, userRes);
          }
        }
      }

      setReviews(restaurantRes.unwrap());
    }
  }

  useEffect(() => {
    if (searchParams && router && !isLoading) {
      if (!searchParams.get("id")) {
        router.back();
      }
      fetchRest();
      fetchReviews();
      fetchRestStats();
    }
  }, [searchParams, router, user, isLoading]);

  return (
    <div className="min-h-full flex flex-col gap-5 md:gap-10">
      {/* User's search parameters */}
      <div className="bg-[#f2f2f2] px-7 md:px-10 pt-[60px] border-b-2 border-b-neutral-200 flex justify-between items-stretch">
        <div className="pb-5">
          <p className="pt-5 text-2xl">{rest.name}</p>
          <div className="flex items-center gap-3 mt-3">
            <Rating value={restStats.avgRating} />
            <p className="text-[11px] 2xl:text-[13px]">
              {restStats.reviewCount == 1
                ? "1 Review"
                : `${restStats.reviewCount} Reviews`}
            </p>
            <p className="text-neutral-600">
              {getBudgetStr(restStats.avgBudget)}
            </p>
          </div>
        </div>
        {user && (
          <div className="flex flex-col justify-center sm:flex-row gap-2 items-center sm:items-end sm:pb-5">
            <button
              className="px-2 py-2 bg-blue-200 hover:bg-blue-300 rounded-full xl:rounded-lg xl:px-3 xl:py-2"
              onClick={() => setShowReviewModal(true)}
            >
              <p className="hidden xl:block">Create Review</p>
              <span className="block xl:hidden">
                <RateReviewOutlinedIcon
                  fontSize="medium"
                  className="opacity-50"
                  titleAccess="Manage Reviews"
                />
              </span>
            </button>
            <button
              className="px-2 py-2 bg-blue-200 hover:bg-blue-300 rounded-full xl:rounded-lg xl:px-3 xl:py-2"
              onClick={() => setShowAddToCollection(true)}
            >
              <p className="hidden xl:block">Add to Collection</p>
              <span className="block xl:hidden">
                <BookmarkBorderIcon
                  fontSize="medium"
                  className="opacity-50"
                  titleAccess="Add to Collection"
                />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Restaurants display */}
      <div className="xl:grid grid-cols-3 2xl:grid-cols-7 pb-15">
        <div className="col-span-2 2xl:col-span-5">
          <div className="pl-10 w-fit">
            {/* <p>Cuisine: Fix Me</p> */}
            {rest.phone && (
              <div className="flex gap-5 items-center mt-3 opacity-60">
                <Image
                  src="/svgs/phone.svg"
                  width={20}
                  height={20}
                  alt="phone"
                />
                <span className="w-fit">{rest.phone}</span>
              </div>
            )}
            {rest.website && (
              <a href={rest.website}>
                <div className="flex gap-5 items-center mt-3 opacity-60">
                  <Image
                    src="/svgs/globe.svg"
                    width={20}
                    height={20}
                    alt="web"
                  />
                  <span className="text-black hover:underline w-fit">
                    {rest.website == "..."
                      ? "..."
                      : new URL(rest.website).hostname.length > 20
                        ? new URL(rest.website).hostname.substring(0, 20) +
                          "..."
                        : new URL(rest.website).hostname}
                  </span>
                </div>
              </a>
            )}
          </div>
          <p className="mt-10 pl-10 mb-3 md:mb-5 text-2xl md:text-3xl">
            Reviews
          </p>
          {reviews.length ? (
            <div className="flex flex-col md:flex-row md:flex-wrap gap-5 overflow-x-scroll scrollbar-none pb-3 px-10 w-full items-center md:items-start">
              {reviews.map((val, idx) => (
                <button
                  key={idx}
                  className="cursor-pointer text-start"
                  onClick={async () => {
                    const prRes = await getPopulatedReview(val._id.toString());
                    const rerr = prRes.anticipate();
                    if (rerr.error) {
                      console.log(
                        `Error: failed to open review: ${rerr.message}`,
                      );
                    } else {
                      setSelReview(prRes.unwrap());
                      setShowRRM(true);
                    }
                  }}
                >
                  <ReviewCard
                    review={val}
                    key={idx}
                    username={uidMap.current.get(val.userId)?.name}
                    uidMap={uidMap}
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-700">
              No results, maybe create a review?
            </p>
          )}
        </div>

        <div className="hidden xl:block w-full h-full 2xl:col-span-2 relative">
          <StickyRestSelect />
        </div>
      </div>

      {selReview && (
        <ReadReviewModal
          visible={showRRM}
          setVisible={setShowRRM}
          review={selReview}
        />
      )}
      {showAddToCollection && user?.sub && (
        <AddToCollectionModal
          userId={user.sub}
          restaurantId={searchParams.get("id")!}
          onClose={() => setShowAddToCollection(false)}
        />
      )}
      {user?.sub && searchParams.get("id") && (
        <CreateReviewModal
          visible={showReviewModal}
          setVisible={setShowReviewModal}
          restaurantId={searchParams.get("id")!}
          userId={user.sub}
        />
      )}
    </div>
  );
}

export default RestPage;
