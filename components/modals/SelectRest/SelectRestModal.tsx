"use client";

import React from "react";
import Modal from "../../general/Modal";
// import Image from "next/image";
import SRMWrap from "./SRMWrap";
import { Restaurant } from "@/types/restaurant";
import { useRouter } from "next/navigation";

function SelectRestModal(props: {
  visible: boolean;
  setVisibile: React.Dispatch<React.SetStateAction<boolean>>;
  onMarkerClick: (rest: Restaurant) => Promise<void>;
}) {
  return (
    <Modal visible={props.visible} setVisibile={props.setVisibile} centered>
      <div className="bg-neutral-800 w-[95vw] md:w-[80vw] 3xl:w-[50vw] h-[70vh] rounded-3xl relative overflow-hidden shadow-xl">
        {/* Background map component */}
        <div className="h-full">
          <SRMWrap onMarkerClick={props.onMarkerClick} />
        </div>

        {/* Corner button */}
        {/* <button
          className="absolute top-[5%] right-[5%] cursor-pointer opacity-70 hover:opacity-100 z-[400]"
          onClick={() => props.setVisibile(false)}
        >
          <div className="w-[35px] h-[35px] bg-neutral-700 rounded-full flex items-center justify-center">
            <Image
              src="/svgs/plus.svg"
              width={25}
              height={25}
              alt="close"
              className="rotate-45"
            />
          </div>
        </button> */}
      </div>
    </Modal>
  );
}

export default SelectRestModal;
