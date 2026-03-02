import Link from "next/link";
import React from "react";

function DemoNav() {
  return (
    <div className="h-0">
      <div className="h-[50px] bg-[#f2f2f2] flex px-10">
        <Link
          href={"/"}
          className="hover:bg-neutral-200 flex items-center px-3"
        >
          Home
        </Link>
        <Link
          href={"/demos/user-auth"}
          className="hover:bg-neutral-200 flex items-center px-3"
        >
          User Auth
        </Link>
        <Link
          href={"/demos/maps-api"}
          className="hover:bg-neutral-200 flex items-center px-3"
        >
          Maps API
        </Link>
        <Link
          href={"/demos/mongodb"}
          className="hover:bg-neutral-200 flex items-center px-3"
        >
          MongoDB
        </Link>
        <Link
          href={"/demos/images-api"}
          className="hover:bg-neutral-200 flex items-center px-3"
        >
          Images API
        </Link>
      </div>
    </div>
  );
}

export default DemoNav;
