"use client";
import { ReviewDocument } from "@/models/Review";
import ReviewCard from "./ReviewCard";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { APIResult } from "@/types/results";
import { PopulatedReview } from "@/types/review";
import { getPopulatedReview } from "@/utils/client/review";
import ReadReviewModal from "../modals/Review/ReadReviewModal";

function LandingReviews(props: {
  reviews: ReviewDocument[];
  setReviews: Dispatch<SetStateAction<ReviewDocument[]>>;
}) {
  const [selReview, setSelReview] = useState<PopulatedReview | undefined>(
    undefined,
  );
  const [showRRM, setShowRRM] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const rawRes = await fetch("/api/review");
      const apiRes = (await rawRes.json()) as APIResult<ReviewDocument[]>;
      if (apiRes.value) {
        props.setReviews(apiRes.value);
      }
    })();
  }, []);

  return (
    <>
      {props.reviews.map((val, idx) => (
        <button
          key={idx}
          className="cursor-pointer text-start"
          onClick={async () => {
            const prRes = await getPopulatedReview(val._id.toString());
            const rerr = prRes.anticipate();
            if (rerr.error) {
              console.log(`Error: failed to open review: ${rerr.message}`);
            } else {
              setSelReview(prRes.unwrap());
              setShowRRM(true);
            }
          }}
        >
          <ReviewCard review={val} key={idx} />
        </button>
      ))}

      {selReview && (
        <ReadReviewModal
          visible={showRRM}
          setVisible={setShowRRM}
          review={selReview}
        />
      )}
    </>
  );
}

export default LandingReviews;
