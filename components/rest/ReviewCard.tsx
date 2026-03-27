"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ReviewDocument } from "@/models/Review";
import { getImagesByReviewId } from "@/utils/client/image";
import Rating from "./Rating";
import { MAPIUser } from "@/types/auth0/mapi_user";
import { getUserById } from "@/utils/client/users";
import {
  getBudgetStr,
  getShortDesc,
  getShortName,
} from "@/utils/client/review";

function ReviewCard(props: { review: ReviewDocument }) {
  const [imageSrc, setImageSrc] = useState("");
  const [user, setUser] = useState<MAPIUser | undefined>();

  useEffect(() => {
    (async () => {
      const imagesRes = await getImagesByReviewId(props.review._id.toString());
      const rerr = imagesRes.anticipate();
      if (rerr.error) {
        console.log(rerr.message);
      } else {
        const images = imagesRes.unwrap();
        if (images.length) {
          setImageSrc(`/api/images?_id=${images[0]._id!}`);
        }
      }

      const userRes = await getUserById(props.review.userId);
      if (userRes) {
        setUser(userRes);
      }
    })();
  }, []);

  return (
    <div className="min-w-70 w-70 h-fit rounded-xl overflow-hidden shadow-lg">
      {imageSrc ? (
        <Image
          src={imageSrc}
          width={0}
          height={0}
          alt="restaurant pic"
          unoptimized
          priority
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="h-40 flex items-center opacity-50">
          <Image
            src="/svgs/bimage.svg"
            width={0}
            height={0}
            alt="restaurant pic"
            unoptimized
            priority
            className="w-full h-10"
          />
        </div>
      )}
      <div className="w-full h-62.5 bg-white bottom-0 left-0 text-neutral-600 p-5 flex flex-col gap-3">
        <b className="text-black">{props.review.title}</b>
        <div className="flex items-center gap-3">
          <Rating value={props.review.rating} />
          {props.review.budget && (
            <p className="text-neutral-600">
              {getBudgetStr(props.review.budget)}
            </p>
          )}
        </div>
        {user && <p>{getShortName(user.name)}</p>}
        {/* <p className="text-[14px] text-blue-400">{props.review.name}</p> */}
        <p className="text-[10px] 2xl:text-[12px] 3xl:text-[14px]">
          {getShortDesc(props.review.description)}
        </p>
      </div>
    </div>
  );
}

export default ReviewCard;
