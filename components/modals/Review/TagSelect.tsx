import { DIET_RESTRICTIONS } from "@/types/tag";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function TagSelect(props: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [tagSearch, setTagSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  function filterTags(filter: string): string[] {
    const modified = filter
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const regex = new RegExp("\\b" + modified, "gi");
    return DIET_RESTRICTIONS.filter((val) =>
      val.replace(/[\u0300-\u036f]/g, "").match(regex),
    ).sort();
  }

  useEffect(() => {
    if (tagSearch) {
      setSuggestions(filterTags(tagSearch));
    } else {
      setSuggestions([]);
    }
  }, [tagSearch]);

  return (
    <div className="relative w-[90%]">
      <div className="flex flex-wrap gap-1">
        {props.tags.map((val, idx) => (
          <div
            key={idx}
            className="px-3 py-1 bg-neutral-200 rounded-xl flex justify-between gap-2"
          >
            {val}

            <button
              onClick={() =>
                props.setTags((prev) =>
                  prev.filter((prevVal) => prevVal != val),
                )
              }
            >
              <Image
                src="/svgs/btrash.svg"
                width={16}
                height={16}
                alt="close"
                className="opacity-50 hover:opacity-70 cursor-pointer"
              />
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        className={
          "mt-1 bg-white shadow-md p-3 w-full border border-neutral-300 " +
          (suggestions.length == 0 ? "rounded-lg" : "rounded-t-lg")
        }
        placeholder="Lookup Tag Here"
        onChange={(e) => setTagSearch(e.target.value)}
      />

      <div className="absolute bottom-0 left-0 translate-y-full max-h-[25vh] rounded-b-lg overflow-y-scroll w-full z-500 divide-solid divide-y divide-gray-200 shadow-md">
        {suggestions.map((val, idx) => (
          <button
            key={idx}
            className="bg-white hover:bg-neutral-100 px-3 py-1 block w-full cursor-pointer"
            onClick={() => props.setTags((prev) => [...prev, val])}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TagSelect;
