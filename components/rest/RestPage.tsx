"use client";
import React, { useEffect, useState } from "react";
import StickyRestSelect from "../forms/StickyRestSelect";
import Image from "next/image";
import ReviewCard from "./ReviewCard";
import Rating from "./Rating";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter, useSearchParams } from "next/navigation";
import { Restaurant } from "@/types/restaurant";
import { getRestaurantById } from "@/utils/client/restaurant";
import Link from "next/link";
import {
  getPopulatedReview,
  getReviewsByRestaurantId,
} from "@/utils/client/review";
import { ReviewDocument } from "@/models/Review";
import { PopulatedReview } from "@/types/review";
import ReadReviewModal from "../modals/Review/ReadReviewModal";

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
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selReview, setSelReview] = useState<PopulatedReview | undefined>(
    undefined,
  );
  const [showRRM, setShowRRM] = useState<boolean>(false);

  async function fetchRest() {
    const restaurantRes = await getRestaurantById(searchParams.get("id")!);
    const rerr = restaurantRes.anticipate();

    if (rerr.error) {
      router.back();
    }

    setRest(restaurantRes.unwrap());
  }

  async function fetchReviews() {
    const restaurantRes = await getReviewsByRestaurantId(
      searchParams.get("id")!,
    );
    const rerr = restaurantRes.anticipate();

    if (rerr.error) {
      console.log(rerr.message);
    } else {
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
    }
  }, [searchParams, router, user, isLoading]);

  return (
    <div className="min-h-full flex flex-col gap-5 md:gap-10">
      {/* User's search parameters */}
      <div className="bg-[#f2f2f2] px-10 pt-[60px] border-b-2 border-b-neutral-200 pb-5 flex justify-between items-end">
        <div>
          <p className="pt-5 text-2xl">{rest.name}</p>
          <div className="flex items-center gap-3 mt-3">
            <Rating value={2.5} />
            <p className="text-[11px] 2xl:text-[13px]">135 Reviews</p>
          </div>
        </div>
        {user && (
          <Link
            className="px-3 py-2 bg-blue-200 hover:bg-blue-300 rounded-lg"
            href={`/posts?restaurantId=${searchParams.get("id")!}`}
          >
            Manage Reviews
          </Link>
        )}
      </div>

      {/* Restaurants display */}
      <div className="xl:grid grid-cols-3 2xl:grid-cols-7 pb-15">
        <div className="col-span-2 2xl:col-span-5">
          <div className="pl-15 w-fit">
            <p>Cuisine: Fix Me</p>
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
                      : new URL(rest.website).hostname}
                  </span>
                </div>
              </a>
            )}
          </div>
          <p className="mt-10 pl-15 mb-3 md:mb-5 text-2xl md:text-3xl">
            Reviews
          </p>
          <div className="flex xl:flex-wrap gap-5 overflow-x-scroll scrollbar-none pb-3 px-10">
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
                <ReviewCard review={val} key={idx} />
              </button>
            ))}
          </div>
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
    </div>
  );
}

export default RestPage;
