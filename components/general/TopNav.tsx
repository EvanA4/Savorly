"use client";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const LINK_DATA = [
  {
    pathname: "/",
    displayStr: "Home",
  },
  {
    pathname: "/collections",
    displayStr: "Collections",
  },
  // {
  //   pathname: "/friends",
  //   displayStr: "Friends",
  // },
  {
    pathname: "/posts",
    displayStr: "Posts",
  },
];

const NOT_PAGE_STYLE =
  "hidden md:flex hover:bg-neutral-200 transition-colors " +
  "duration-200 pt-[2px] border-b-2 border-b-neutral-100 hover:border-b-blue-500 " +
  "items-center px-3 z-20";
const IS_PAGE_STYLE =
  "hidden md:flex hover:bg-neutral-200 transition-colors " +
  "duration-200 pt-[2px] border-b-2 border-b-blue-500 " +
  "items-center px-3 z-20";

function TopNav() {
  const { user, isLoading } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);
  const pathname = usePathname();

  const divRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleClick(ev: MouseEvent) {
    if (
      ev.target &&
      divRef.current &&
      btnRef.current &&
      !divRef.current.contains(ev.target as Node)
    ) {
      if (
        ev.target == btnRef.current ||
        btnRef.current.contains(ev.target as Node)
      ) {
        setShowSignIn((prev) => !prev);
      } else {
        setShowSignIn((prev) => {
          if (prev) {
            ev.stopPropagation();
          }
          return false;
        });
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [divRef]);

  return (
    <div className="w-full fixed top-0 left-0">
      <div className="h-[60px] bg-[#f2f2f2] flex justify-between items-center border-b-2 border-b-neutral-200 z-10 px-3">
        <Link href="/" className="h-[80%]">
          <Image
            src="/logo.png"
            width={1264}
            height={438}
            alt="Savorly logo"
            unoptimized
            priority
            className="h-full w-auto pl-3 object-contain"
          />
        </Link>
        <div className="flex md:px-10 h-full">
          {LINK_DATA.map((val, idx) => (
            <Link
              href={val.pathname}
              className={
                pathname == val.pathname ? IS_PAGE_STYLE : NOT_PAGE_STYLE
              }
              key={idx}
            >
              {val.displayStr}
            </Link>
          ))}

          <div className="relative h-full">
            <button
              ref={btnRef}
              className="p-2 border-b-2 border-b-neutral-100 hover:border-b-blue-500 hover:bg-neutral-200 flex gap-2 items-center h-full"
            >
              {user ? (
                <Image
                  src={user.picture ?? ""}
                  alt={user.name ?? ""}
                  width={100}
                  height={100}
                  priority
                  className="h-full w-auto object-contain rounded-full"
                />
              ) : (
                <Image
                  src="/profile.png"
                  alt="default profile"
                  width={128}
                  height={128}
                  priority
                  className="h-full w-auto object-contain rounded-full opacity-70"
                />
              )}

              <Image
                src="/svgs/droparrow.svg"
                alt="drop down"
                width={0}
                height={0}
                unoptimized
                className={
                  "h-[70%] w-auto object-contain opacity-70 transition-transform duration-200 " +
                  (showSignIn ? "rotate-180" : "")
                }
              />
            </button>

            <div
              ref={divRef}
              className={
                "absolute w-full bottom-0 right-0 translate-y-[100%] rounded-b-2xl shadow-2xl transition-all duration-200 overflow-hidden"
              }
              style={{ height: showSignIn ? "40px" : "0" }}
            >
              {/* <a
                href={"/profile"}
                className="block bg-neutral-200 hover:bg-neutral-300 w-full text-center py-2"
              >
                Account
              </a> */}
              <a
                href={isLoading ? "" : user ? "/auth/logout" : "/auth/login"}
                className="block bg-neutral-200 hover:bg-neutral-300 w-full text-center py-2"
              >
                {isLoading ? "" : user ? "Log out" : "Log in"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
