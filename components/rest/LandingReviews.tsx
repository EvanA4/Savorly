"use client";
import { ReviewDocument } from "@/models/Review";
import ReviewCard from "./ReviewCard";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { APIResult } from "@/types/results";
import { PopulatedReview } from "@/types/review";
import { getPopulatedReview } from "@/utils/client/review";
import ReadReviewModal from "../modals/Review/ReadReviewModal";
import { MAPIUser } from "@/types/auth0/mapi_user";
import { getUserById } from "@/utils/client/users";

function LandingReviews(props: {
  reviews: ReviewDocument[];
  setReviews: Dispatch<SetStateAction<ReviewDocument[]>>;
  isLoading: boolean;
}) {
  const [selReview, setSelReview] = useState<PopulatedReview | undefined>(
    undefined,
  );
  const [showRRM, setShowRRM] = useState<boolean>(false);
  const uidMap = useRef<Map<string, MAPIUser>>(new Map<string, MAPIUser>());

  useEffect(() => {
    (async () => {
      const rawRes = await fetch("/api/review");
      const apiRes = (await rawRes.json()) as APIResult<ReviewDocument[]>;
      if (apiRes.value) {
        for (let i = 0; i < apiRes.value.length; ++i) {
          if (!uidMap.current.has(apiRes.value[i].userId)) {
            const userRes = await getUserById(apiRes.value[i].userId);
            if (userRes) {
              uidMap.current.set(apiRes.value[i].userId, userRes);
            }
          }
        }
        props.setReviews(apiRes.value);
      }
    })();
  }, []);

  return (
    <>
      {props.reviews.length == 0 && (
        <p className="text-center w-full">
          {props.isLoading ? "Loading..." : "No reviews, try creating one!"}
        </p>
      )}
      {props.reviews.map((val, idx) => {
        return (
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
            <ReviewCard
              review={val}
              key={idx}
              username={uidMap.current.get(val.userId)?.name}
              uidMap={uidMap}
            />
          </button>
        );
      })}

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
