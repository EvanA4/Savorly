"use client";
import CRUDReviewCard from "@/components/profile/posts/CRUDReviewCard";
import { ReviewDocument } from "@/models/Review";
import { Restaurant } from "@/types/restaurant";
import { PopulatedReview } from "@/types/review";
import { getRestaurantById } from "@/utils/client/restaurant";
import {
  deleteReview,
  getPopulatedReview,
  getReviewsByUserId,
} from "@/utils/client/review";
import { User } from "@auth0/nextjs-auth0/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import React, { useEffect } from "react";

function PostList(props: {
  reviews: ReviewDocument[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewDocument[]>>;
  setPopReview: React.Dispatch<
    React.SetStateAction<PopulatedReview | undefined>
  >;
  user: User | null | undefined;
  isLoading: boolean;
  router: AppRouterInstance;
  searchParams: ReadonlyURLSearchParams;
  setShowReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  rest: Restaurant | undefined;
  setRest: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
}) {
  const {
    reviews,
    setReviews,
    setPopReview,
    user,
    isLoading,
    searchParams,
    setShowReviewModal,
    rest,
    setRest,
  } = props;

  async function refreshPosts() {
    const spget = searchParams.get("restaurantId");
    const res = await getReviewsByUserId(user!.sub, spget ? spget! : undefined);
    const rerr = res.anticipate();
    if (rerr.error) {
      console.log(rerr.message);
    } else {
      const tmpPosts = res.unwrap();
      setReviews(tmpPosts);
    }
  }

  useEffect(() => {
    if (!isLoading && user && searchParams) {
      refreshPosts();
    }
  }, [user, isLoading, searchParams]);

  async function handleEdit(toEdit: ReviewDocument) {
    // get populated review
    const reviewRes = await getPopulatedReview(toEdit._id.toString());
    let rerr = reviewRes.anticipate();
    if (rerr.error) {
      console.log(rerr.message);
      return;
    }

    // get restaurant
    if (!rest || rest.mapboxId != toEdit.restaurantId) {
      const restRes = await getRestaurantById(toEdit.restaurantId);
      rerr = restRes.anticipate();
      if (rerr.error) {
        console.log(rerr.message);
        return;
      }
      setRest(restRes.unwrap());
    }

    // set value to state var
    setPopReview(reviewRes.unwrap());

    // show review modal
    setShowReviewModal((prev) => !prev);
  }

  async function handleDelete(toDelete: ReviewDocument) {
    const res = await deleteReview(toDelete._id.toString());
    const rerr = res.anticipate();
    if (rerr.error) {
      console.log(rerr);
    } else {
      setReviews((prev) =>
        prev.filter((x) => x._id.toString() != toDelete._id.toString()),
      );
    }
  }

  return (
    <div className="flex xl:flex-wrap gap-5 pb-3 pt-15 px-10 bg-[#f2f2f2]">
      {reviews.map((val, idx) => (
        <CRUDReviewCard
          review={val}
          key={idx}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}

export default PostList;
