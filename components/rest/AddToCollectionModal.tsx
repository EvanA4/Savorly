"use client";

import { getUserPlans, addRestaurantToPlan } from "@/utils/client/plan";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Link from "next/link";
import { useEffect, useState } from "react";

type AddToCollectionModalProps = {
  userId: string;
  restaurantId: string;
  onClose: () => void;
};

export default function AddToCollectionModal({
  userId,
  restaurantId,
  onClose,
}: AddToCollectionModalProps) {
  const [plans, setPlans] = useState<
    { id: string; name: string; hasRestaurant: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      const res = await getUserPlans(userId);
      if (!res.anticipate().error) {
        setPlans(
          res.unwrap().map((p) => ({
            id: p.planId,
            name: p.name,
            hasRestaurant: p.restaurants.some(
              (r) => r.mapboxId === restaurantId,
            ),
          })),
        );
      }
      setLoading(false);
    }
    fetchPlans();
  }, [userId, restaurantId]);

  async function handleAdd(planId: string) {
    setAdding(true);
    setError("");
    setSuccess("");
    try {
      const res = await addRestaurantToPlan(planId, restaurantId);
      if (res.anticipate().error) {
        setError(res.anticipate().message ?? "Failed to add to collection.");
      } else {
        setSuccess("Added successfully!");
        setPlans((prev) =>
          prev.map((p) =>
            p.id === planId ? { ...p, hasRestaurant: true } : p,
          ),
        );
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-700">
            Add to Collection
          </p>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Link
            href="/collections"
            className="flex flex-col items-center gap-1 mt-4 mb-4"
          >
            <p className="text-m text-gray-400">You have no collections yet.</p>
            <p className="text-m text-gray-400">
              Click here to go to the Collections page.
            </p>
          </Link>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {plans.map((plan) => (
              <button
                key={plan.id}
                disabled={adding || plan.hasRestaurant}
                onClick={() => !plan.hasRestaurant && handleAdd(plan.id)}
                className={`w-full text-left px-4 py-3 border rounded-lg transition-all text-sm flex items-center justify-between
                  ${
                    plan.hasRestaurant
                      ? "border-green-200 bg-green-50 text-gray-400 cursor-default"
                      : "border-gray-100 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
                  } disabled:opacity-70`}
              >
                <span>{plan.name}</span>
                {plan.hasRestaurant && (
                  <CheckIcon fontSize="small" className="!text-green-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}
        {success && <p className="text-xs text-green-500">{success}</p>}
      </div>
    </div>
  );
}
