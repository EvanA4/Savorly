"use client";
import { ReviewDocument } from "@/models/Review";
import ReviewCard from "./ReviewCard";
import { Dispatch, SetStateAction, useEffect } from "react";
import { APIResult } from "@/types/results";

function LandingReviews(props: {
  reviews: ReviewDocument[];
  setReviews: Dispatch<SetStateAction<ReviewDocument[]>>;
}) {
  useEffect(() => {
    (async () => {
      const rawRes = await fetch("/api/review");
      const apiRes = (await rawRes.json()) as APIResult<ReviewDocument[]>;
      if (apiRes.value) {
        props.setReviews(apiRes.value);
      }
    })();
  }, []);

  return props.reviews.map((val, idx) => <ReviewCard review={val} key={idx} />);
}

export default LandingReviews;
