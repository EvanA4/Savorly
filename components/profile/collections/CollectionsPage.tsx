"use client";

import Nav from "@/components/general/Nav";
import CollectionList from "@/components/profile/collections/CollectionList";
import { getUserPlans } from "@/utils/client/plan";
import { useUser } from "@auth0/nextjs-auth0";
import AddIcon from "@mui/icons-material/Add";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import CreateCollectionModal from "./CreateCollectionModal";

export default function CollectionsPage() {
  const { user, isLoading } = useUser();
  const [collections, setCollections] = useState<
    { id: string; name: string; restaurants: string[] }[]
  >([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    useState(false);

  async function getCollections(userId: string) {
    setCollectionsLoading(true);

    try {
      // get user's collections
      const populatedPlansRes = await getUserPlans(userId);
      const rerr = populatedPlansRes.anticipate();
      if (rerr.error) {
        console.log(rerr.message);
      }

      const collectionsWithRestaurants = populatedPlansRes
        .unwrap()
        .map((plan) => ({
          id: plan.planId,
          name: plan.name,
          restaurants: plan.restaurants.map((r) => r.name),
        }));

      setCollections(collectionsWithRestaurants);
    } catch (e) {
      console.error("Failed to fetch collections", e);
    } finally {
      setCollectionsLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoading && user?.sub) {
      getCollections(user.sub);
    } else if (!isLoading && !user) {
      setCollectionsLoading(false);
    }
  }, [user, isLoading]);

  return (
    <div className="h-full relative">
      <div className="pt-15 border-b border-b-gray-300 flex items-center justify-between">
        <p className=" pl-4 py-4 text-2xl">Collections</p>
        {/* add collection edit modal here? */}
        <IconButton
          className="mr-8!"
          onClick={() => setShowCreateCollectionModal(true)}
        >
          <AddIcon fontSize="large" />
        </IconButton>

        {showCreateCollectionModal && user?.sub && (
          <CreateCollectionModal
            userId={user.sub}
            onClose={() => setShowCreateCollectionModal(false)}
            onCreated={() => getCollections(user.sub!)}
          />
        )}
      </div>
      <div className="pt-5 flex flex-col items-center justify-center gap-4 pb-16.25 md:pb-0">
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
        ) : !user ? (
          <div className="flex flex-col items-center justify-center gap-4 mt-16 px-6 text-center">
            <div className="rounded-2xl p-10 flex flex-col items-center gap-4 w-full max-w-sm md:max-w-md shadow-sm border border-gray-100">
              <div className="bg-blue-50 rounded-full p-4">
                <BookmarkBorderIcon className="text-4xl! text-blue-400" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold text-gray-700">
                  Save your favorite spots
                </p>
                <p className="text-sm text-gray-400">
                  Sign in or create an account to start building collections.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <a
                  href="/auth/login"
                  className="flex-1 text-center px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Sign in
                </a>
                <a
                  href="/auth/login?screen_hint=signup"
                  className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Create account
                </a>
              </div>
            </div>
          </div>
        ) : (
          collections.map((collection) => (
            <CollectionList
              key={collection.id}
              planId={collection.id}
              name={collection.name}
              restaurants={collection.restaurants}
              onDeleted={() => getCollections(user.sub!)}
            />
          ))
        )}
      </div>

      {/* Bottom Navbar */}
      <Nav />
    </div>
  );
}
