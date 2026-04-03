"use client";

import { Restaurant, RESTAURANT_TYPES } from "@/types/restaurant";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import RestSubcomponent from "../../rest/RestSubcomponent";
import RestMarker from "./RestMarker";
import { sleep } from "@/utils/sleep";
import Image from "next/image";
import MultiSelectDD from "@/components/general/MultiSelectDD";
import SingleSelectDD from "@/components/general/SingleSelectDD";
import { Map } from "leaflet";
import { poiSearchRests } from "@/utils/client/poi";

function SRMMap(props: { onMarkerClick: (rest: Restaurant) => Promise<void> }) {
  const [rests, setRests] = useState<Restaurant[]>([]);
  const cuisines = ["All cuisines", ...RESTAURANT_TYPES];
  const restrictions = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const [selRestricts, setSelRestricts] = useState<boolean[]>(
    Array(restrictions.length).fill(false),
  );
  const [selCuisine, setSelCuisine] = useState<number>(0);
  const [searchStr, setSearchStr] = useState<string>("");
  const [isMarkerOpen, setIsMarkerOpen] = useState<boolean>(false);
  const [map, setMap] = useState<Map | undefined>(undefined);
  const [showTips, setShowTips] = useState(true);

  function getTipMsg() {
    if (rests.length == 0) return "Click the map or use the search bar!";
    else if (!isMarkerOpen) return "Click on marker to view the restaurant!";
    else return "Click the restaurant name to visit its page!";
  }

  async function refreshRests(toSearch: {
    searchStr: string;
    lat: number;
    lng: number;
    cuisine: string;
    restrictions: string[];
  }) {
    const restaurantRes = await poiSearchRests(toSearch);
    const rerr = restaurantRes.anticipate();

    if (rerr.error) {
      console.log(`Failed to fetch restaurants: ${rerr.message}`);
    }

    setRests(restaurantRes.unwrap());
  }

  async function handleSearch() {
    console.log("Searching!");
    if (map) {
      const mapCenter = map.getCenter();
      const toSend = {
        searchStr: searchStr,
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        cuisine: cuisines[selCuisine],
        restrictions: selRestricts
          .map((val, idx) => (val ? restrictions[idx] : undefined))
          .filter((val) => val !== undefined),
      };
      refreshRests(toSend);
    }
  }

  async function handleClick(mouseLat: number, mouseLng: number) {
    if (!isMarkerOpen) {
      const toSend = {
        searchStr: "",
        lat: mouseLat,
        lng: mouseLng,
        cuisine: cuisines[selCuisine],
        restrictions: selRestricts
          .map((val, idx) => (val ? restrictions[idx] : undefined))
          .filter((val) => val !== undefined),
      };
      refreshRests(toSend);
    }
  }

  async function handlePopupOpen() {
    setIsMarkerOpen(true);
  }
  async function handlePopupClose() {
    // time before user can click for restaurants after closing marker
    await sleep(500);
    setIsMarkerOpen(false);
  }

  return (
    <div className="h-full relative">
      <div className="py-4 px-4 flex justify-between h-[30%] absolute top-0 left-0 w-full">
        <div className="flex w-[60%] rounded-lg overflow-hidden shadow-md h-fit z-401">
          <input
            type="text"
            className="bg-white shadow-md outline-none px-3 py-2 w-full"
            placeholder="Enter restaurant..."
            onChange={(e) => setSearchStr(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") handleSearch();
            }}
          />
          <button
            className="bg-neutral-100 hover:bg-neutral-200 px-3 py-2 cursor-pointer text-white"
            onClick={handleSearch}
          >
            <Image src="/svgs/search.svg" width={20} height={20} alt="search" />
          </button>
        </div>
        <div className="w-[35%] flex flex-col gap-3">
          <div className="shadow-md z-[402]">
            <SingleSelectDD
              options={cuisines}
              selected={selCuisine}
              setSelected={setSelCuisine}
            />
          </div>
          {/* <MultiSelectDD
            options={restrictions}
            selected={selRestricts}
            setSelected={setSelRestricts}
            formatStr="%d restriction(s)"
          /> */}
        </div>
      </div>

      <div className="h-full">
        <MapContainer
          center={[35.95077372972164, -83.93390908189826]}
          zoom={14}
          scrollWheelZoom={true}
          zoomControl={false}
          className="h-full"
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {rests.map((rest, idx) => (
            <Marker position={[rest.lat, rest.lng]} key={idx}>
              <Popup>
                <RestMarker rest={rest} onMarkerClick={props.onMarkerClick} />
              </Popup>
            </Marker>
          ))}
          <RestSubcomponent
            setMap={setMap}
            onClick={handleClick}
            onPopupOpen={handlePopupOpen}
            onPopupClose={handlePopupClose}
          />
        </MapContainer>
      </div>

      {showTips && (
        <div className="absolute bottom-0 left-0 w-full z-400 flex justify-center pb-3 opacity-80">
          <div className="w-[90%] bg-neutral-100 px-3 py-2 rounded-lg grid grid-cols-10 shadow-lg">
            <div className="col-span-9">{getTipMsg()}</div>

            <button
              className="flex justify-center items-center"
              onClick={() => setShowTips(false)}
            >
              <Image
                src="/svgs/close.svg"
                width={16}
                height={16}
                alt="close"
                className="opacity-50 hover:opacity-70 cursor-pointer"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SRMMap;
