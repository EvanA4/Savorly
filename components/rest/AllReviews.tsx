"use client";
import { ReviewDocument } from "@/models/Review";
import ReviewCard from "./ReviewCard";
import { useEffect, useState } from "react";
import { APIResult } from "@/types/results";

function AllReviews() {
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);

  useEffect(() => {
    (async () => {
      const rawRes = await fetch("/api/review");
      const apiRes = (await rawRes.json()) as APIResult<ReviewDocument[]>;
      if (apiRes.value) {
        setReviews(apiRes.value);
      }
    })();
  }, []);

  return reviews.map((val, idx) => <ReviewCard review={val} key={idx} />);
}

export default AllReviews;
