"use client";

import { Restaurant } from "@/types/restaurant";
import dynamic from "next/dynamic";
import { useMemo } from "react";

function SRMWrap(props: {
  onMarkerClick: (rest: Restaurant) => Promise<void>;
}) {
  const SRMMap = useMemo(
    () =>
      dynamic(() => import("@/components/modals/SelectRest/SRMMap"), {
        loading: () => (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200">
            <p className="text-2xl">
              <b>Loading...</b>
            </p>
          </div>
        ),
        ssr: false,
      }),
    [],
  );

  return <SRMMap onMarkerClick={props.onMarkerClick} />;
}

export default SRMWrap;
