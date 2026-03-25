"use client";
import Link from "next/link";
import React from "react";

function BottomNav() {
  return (
    <div className="w-full fixed bottom-0 left-0 md:hidden">
      <div className="h-[60px] bg-[#f2f2f2] flex justify-center items-center border-t-2 border-t-neutral-200 z-10 px-3">
        <div className="flex md:px-10 h-full">
          <Link
            href={"/"}
            className="flex hover:bg-neutral-200 transition-colors duration-200 pt-[2px] border-b-2 border-b-neutral-100 hover:border-b-blue-500 items-center px-3 z-20"
          >
            Home
          </Link>
          <Link
            href={"/collections"}
            className="flex hover:bg-neutral-200 transition-colors duration-200 pt-[2px] border-b-2 border-b-neutral-100 hover:border-b-blue-500 items-center px-3 z-20"
          >
            Collections
          </Link>
          <Link
            href={"/friends"}
            className="flex hover:bg-neutral-200 transition-colors duration-200 pt-[2px] border-b-2 border-b-neutral-100 hover:border-b-blue-500 items-center px-3 z-20"
          >
            Friends
          </Link>
          <Link
            href={"/posts"}
            className="flex hover:bg-neutral-200 transition-colors duration-200 pt-[2px] border-b-2 border-b-neutral-100 hover:border-b-blue-500 items-center px-3 z-20"
          >
            Posts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
