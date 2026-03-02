"use client";

import DemoNav from "@/components/general/DemoNav";
import { IMovie } from "@/models/Movie";
import { fetch3Movies } from "@/utils/client/movies";
import React, { useEffect, useState } from "react";

function MongoPage() {
  const [movies, setMovies] = useState<IMovie[]>([]);

  async function fetchMovies() {
    const res = await fetch3Movies();
    const rerr = res.anticipate();
    if (rerr.error) {
      console.log(`Failed to fetch movies: ${rerr.message}`);
    }
    setMovies(res.unwrap());
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="h-full">
      <DemoNav />
      <div className="h-full flex flex-col items-center justify-center">
        <p>You should see some movies below!</p>
        <div className="w-[50%] flex flex-col gap-3 mt-5">
          {movies.map((val, idx) => (
            <div key={idx} className="bg-neutral-200 p-3 rounded-xl">
              <p>
                <b>{val.title}</b>{" "}
                <i className="text-neutral-500">{val.year}</i>
              </p>
              <p>{val.plot}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MongoPage;
