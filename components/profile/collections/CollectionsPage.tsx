"use client";

import Nav from "@/components/general/Nav";
import CollectionList from "@/components/profile/collections/CollectionList";
import { getRestaurantsInPlan, getUserPlans } from "@/utils/client/plan";
import { useUser } from "@auth0/nextjs-auth0";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";

export default function CollectionsPage() {
  const { user, isLoading } = useUser();
  const [collections, setCollections] = useState<
    { name: string; restaurants: string[] }[]
  >([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  async function getCollections() {
    setCollectionsLoading(true);

    try {
      // get user's collections
      const plansRes = await getUserPlans(user!.sub);
      const rerr = plansRes.anticipate();
      if (rerr.error) {
        console.log(rerr.message);
      }

      // get all restaurants in user's collections
      const collectionsWithRestaurants = await Promise.all(
        plansRes.unwrap().map(async (plan) => {
          const restaurantsRes = await getRestaurantsInPlan(
            plan._id.toString(),
          );
          const restaurantsErr = restaurantsRes.anticipate();
          if (restaurantsErr.error) {
            console.error(restaurantsErr.message);
            return { name: plan.name, restaurants: [] };
          }
          return {
            name: plan.name,
            restaurants: restaurantsRes.unwrap().map((r) => r.name),
          };
        }),
      );

      setCollections(collectionsWithRestaurants);
    } catch (e) {
      console.error("Failed to fetch collections", e);
    } finally {
      setCollectionsLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      getCollections();
    }
  }, [user, isLoading]);

  return (
    <div className="h-full relative">
      <div className="pt-[60px] border-b-1 border-b-gray-300 flex items-center justify-between">
        <p className=" pl-4 py-4 text-2xl">Collections</p>
        {/* add collection edit modal here? */}
        <IconButton className="mr-8!">
          <AddIcon fontSize="large" />
        </IconButton>
      </div>
      <div className="pt-5 flex flex-col items-center justify-center gap-4 pb-[65px] md:pb-[0px]">
        {isLoading || collectionsLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[90%] md:w-[70%] rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </>
        ) : (
          collections.map((collection) => (
            <CollectionList
              key={collection.name}
              name={collection.name}
              restaurants={collection.restaurants}
            />
          ))
        )}
      </div>

      {/* Bottom Navbar */}
      <Nav />
    </div>
  );
}
