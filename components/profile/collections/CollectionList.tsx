"use client";

import CollectionItem from "./CollectionItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { useState } from "react";
import { deletePlan, deleteRestaurantFromPlan } from "@/utils/client/plan";

type CollectionListProps = {
  planId: string;
  name: string;
  restaurants: string[]; // restaurant ID's
  onDeleted: () => void;
};

export default function CollectionList({
  planId,
  name,
  restaurants,
  onDeleted,
}: CollectionListProps) {
  const [editing, setEditing] = useState(false);

  async function handleDeleteCollection() {
    const res = await deletePlan(planId);
    if (!res.anticipate().error) onDeleted();
  }

  async function handleDeleteRestaurant(restaurantId: string) {
    const res = await deleteRestaurantFromPlan(planId, restaurantId);
    if (!res.anticipate().error) onDeleted();
  }

  return (
    <div className="w-[90%] md:w-[70%] flex items-start gap-1">
      {/* Minus button for deleting the collection */}
      {editing && (
        <div className="flex items-center pt-3">
          <IconButton
            size="medium"
            className="text-red-400! hover:text-red-600!"
            onClick={handleDeleteCollection}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </div>
      )}

      <div className="flex-1">
        <Accordion
          className="w-full rounded-xl! shadow-sm! border border-gray-100"
          disableGutters
        >
          <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
            <div className="flex w-full items-center justify-between">
              <span className="text-xl font-medium">{name}</span>
              <IconButton
                className={`pr-3! ${editing ? "text-blue-400!" : "text-gray-400!"} hover:text-gray-600!`}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing((prev) => !prev);
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
          </AccordionSummary>
          <AccordionDetails className="flex flex-col gap-3">
            {restaurants?.length === 0 ? (
              <Link href="/" className="group">
                <div className="flex flex-col items-center justify-center py-6 text-gray-400 transition-colors group-hover:text-gray-600">
                  <RestaurantIcon className="text-4xl! transition-transform" />
                  <p className="text-sm">
                    {" "}
                    This collection is looking a little hungry...
                  </p>
                  <p className="text-sm">Explore restaurants to get started!</p>
                </div>
              </Link>
            ) : (
              restaurants?.map((id) => (
                <div key={id} className="flex items-center">
                  {editing && (
                    <IconButton
                      size="medium"
                      className="text-red-400! hover:text-red-600!"
                      onClick={() => handleDeleteRestaurant(id)}
                    >
                      <RemoveCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                  <div className="flex-1">
                    <CollectionItem RestaurantId={id} />
                  </div>
                </div>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
