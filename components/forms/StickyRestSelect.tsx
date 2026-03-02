"use client";
import React from "react";
import SRMWrap from "../modals/SelectRest/SRMWrap";
import { Restaurant } from "@/types/restaurant";
import { useRouter } from "next/navigation";

function StickyRestSelect() {
  const router = useRouter();

  async function handleMarkerClick(rest: Restaurant) {
    router.push(`/restaurant?id=${rest.mapboxId}`);
  }

  return (
    <div className="sticky top-24 pr-10">
      <div className="h-[70vh] shadow-xl rounded-2xl overflow-hidden">
        <SRMWrap onMarkerClick={handleMarkerClick} />
      </div>
    </div>
  );
}

export default StickyRestSelect;
