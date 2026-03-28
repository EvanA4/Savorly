"use client";
import Image from "next/image";
import React, { useState } from "react";

function RatingSelect(props: {
  ratingInput: number;
  setRatingInput: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [highlight, setHighlight] = useState<number>(0);
  const STAR_DATA = [
    {
      url: "/svgs/bstar.svg",
      alt: "black star",
    },
    {
      url: "/svgs/hstar.svg",
      alt: "half star",
    },
    {
      url: "/svgs/ystar.svg",
      alt: "full star",
    },
  ];

  return (
    <div>
      <p>Rating</p>
      <div
        className="w-75 grid grid-cols-5 mx-auto"
        onMouseLeave={() => setHighlight(0)}
      >
        {[1, 2, 3, 4, 5].map((val) => {
          const starNum = highlight ? highlight : props.ratingInput;
          let starType = 0; // 0 = empty, 1 = half, 2 = full
          if (val - 0.5 == starNum) starType = 1;
          if (val <= starNum) starType = 2;

          return (
            <div key={val} className="h-full relative">
              <button
                className="w-[50%] h-full absolute top-0 left-0"
                onMouseEnter={() => setHighlight(val - 0.5)}
                onClick={() => {
                  // console.log(`Setting rating to ${val - 0.5}`);
                  props.setRatingInput(val - 0.5);
                }}
              ></button>
              <button
                className="w-[50%] h-full absolute top-0 left-[50%]"
                onMouseEnter={() => setHighlight(val)}
                onClick={() => {
                  // console.log(`Setting rating to ${val}`);
                  props.setRatingInput(val);
                }}
              ></button>
              <Image
                src={STAR_DATA[starType].url}
                width={0}
                height={0}
                alt={STAR_DATA[starType].alt}
                className="h-10 w-auto object-contain mx-auto"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RatingSelect;
