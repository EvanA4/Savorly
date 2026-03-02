"use client";
import { Restaurant } from "@/types/restaurant";
import Image from "next/image";
import React from "react";

function RestMarker(props: {
  rest: Restaurant;
  onMarkerClick: (rest: Restaurant) => Promise<void>;
}) {
  const { rest } = props;
  return (
    <div className="w-[200px] pb-3">
      <button onClick={() => props.onMarkerClick(rest)}>
        <span className="text-xl m-0 p-0 block text-black text-start cursor-pointer">
          {rest.name}
        </span>
      </button>
      {rest.phone && (
        <div className="flex gap-5 items-center mt-3 opacity-60">
          <Image src="/svgs/phone.svg" width={20} height={20} alt="phone" />
          <span className="w-fit">{rest.phone}</span>
        </div>
      )}
      {rest.website && (
        <a href={rest.website}>
          <div className="flex gap-5 items-center mt-3 opacity-60">
            <Image src="/svgs/globe.svg" width={20} height={20} alt="web" />
            <span className="text-black hover:underline w-fit">
              {new URL(rest.website).hostname}
            </span>
          </div>
        </a>
      )}
    </div>
  );
}

export default RestMarker;
