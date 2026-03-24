"use client";
import PostSearch from "@/components/forms/PostSearch";
import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import PostList from "./PostList";
import { PopulatedReview } from "@/types/review";
import { ReviewDocument } from "@/models/Review";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter, useSearchParams } from "next/navigation";
import { Restaurant } from "@/types/restaurant";
import ReviewModal from "@/components/modals/Review/ReviewModal";

function PostsPage() {
  const [popReview, setPopReview] = useState<PopulatedReview | undefined>();
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [rest, setRest] = useState<Restaurant | undefined>();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.back();
      }
    }
  }, [user, isLoading, router]);

  return (
    <>
      {/* User's search parameters */}
      <PostSearch
        setReviews={setReviews}
        user={user}
        searchParams={searchParams}
      />

      {/* Scrollable Section (User's Info and Posts Display) */}
      <div className="flex-1 overflow-y-auto bg-[#f2f2f2]">
        <UserInfo
          user={user}
          isLoading={isLoading}
          router={router}
          rest={rest}
          setRest={setRest}
          searchParams={searchParams}
          setPopReview={setPopReview}
          setShowReviewModal={setShowReviewModal}
          reviews={reviews}
        />

        <PostList
          reviews={reviews}
          setReviews={setReviews}
          setPopReview={setPopReview}
          searchParams={searchParams}
          user={user}
          isLoading={isLoading}
          router={router}
          setShowReviewModal={setShowReviewModal}
          rest={rest}
          setRest={setRest}
        />
      </div>

      {(rest || searchParams.get("restaurantId")) && (
        <ReviewModal
          visible={showReviewModal}
          setVisible={setShowReviewModal}
          review={popReview}
          setReview={setPopReview}
          setReviews={setReviews}
          userId={user ? user.sub : ""}
          restaurantId={
            rest ? rest.mapboxId : searchParams.get("restaurantId")!
          }
        />
      )}
    </>
  );
}

export default PostsPage;
