"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LINK_DATA = [
  {
    pathname: "/",
    displayStr: "Home",
    svgSrc: "/svgs/home.svg",
  },
  {
    pathname: "/collections",
    displayStr: "Collections",
    svgSrc: "/svgs/heart.svg",
  },
  // {
  //   pathname: "/friends",
  //   displayStr: "Friends",
  //   svgSrc: "/svgs/friends.svg",
  // },
  {
    pathname: "/posts",
    displayStr: "Posts",
    svgSrc: "/svgs/user.svg",
  },
];

const NOT_PAGE_STYLE =
  "flex flex-col h-full justify-between py-1 border-b-2 border-b-neutral-100 px-2";
const IS_PAGE_STYLE =
  "flex flex-col h-full justify-between py-1 border-b-2 border-b-blue-500 px-2";

function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="w-full fixed bottom-0 left-0 md:hidden">
      <div className="h-15 bg-[#f2f2f2] flex justify-center items-center border-t-2 border-t-neutral-200 z-10 px-3">
        <div className="flex md:px-10 h-full">
          {LINK_DATA.map((val, idx) => (
            <div
              key={idx}
              className={
                val.pathname == pathname ? IS_PAGE_STYLE : NOT_PAGE_STYLE
              }
            >
              <Image
                src={val.svgSrc}
                alt={val.displayStr + " icon"}
                height={0}
                width={0}
                unoptimized
                className="w-auto h-8 opacity-50 hover:opacity-100 cursor-pointer"
              />
              <Link
                href={val.pathname}
                className="flex hover:bg-neutral-200 transition-colors duration-200 pt-[2px] items-center px-3 z-20 text-[10px]"
                key={idx}
              >
                {val.displayStr}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
