"use client";
import React, { useEffect, useState } from "react";
import Rating from "../../rest/Rating";
import Image from "next/image";
import { ReviewDocument } from "@/models/Review";
import { getImagesByReviewId } from "@/utils/client/image";

function CRUDReviewCard(props: {
  review: ReviewDocument;
  onEdit: (review: ReviewDocument) => void;
  onDelete: (review: ReviewDocument) => void;
}) {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    (async () => {
      const res = await getImagesByReviewId(props.review._id.toString());
      const rerr = res.anticipate();
      if (rerr.error) {
        console.log(rerr.message);
      } else {
        const images = res.unwrap();
        if (images.length) {
          setImageSrc(`/api/images?_id=${images[0]._id!}`);
        }
      }
    })();
  }, []);

  return (
    <div className="min-w-70 w-70 h-fit rounded-xl overflow-hidden shadow-lg relative">
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
        </div>
        {/* <p className="text-[14px] text-blue-400">{props.review.name}</p> */}
        <p className="text-[10px] 2xl:text-[12px] 3xl:text-[14px]">
          {props.review.description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full flex justify-center gap-5 py-3">
        <button onClick={() => props.onEdit(props.review)}>
          <Image
            src="/svgs/bedit.svg"
            alt="edit icon"
            height={0}
            width={0}
            unoptimized
            className="w-auto h-6.25 opacity-50 hover:opacity-100 cursor-pointer"
          />
        </button>

        <button onClick={() => props.onDelete(props.review)}>
          <Image
            src="/svgs/btrash.svg"
            alt="delete icon"
            height={0}
            width={0}
            unoptimized
            className="w-auto h-6.25 opacity-50 hover:opacity-100 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
}

export default CRUDReviewCard;
