// components/modals/AddToCollectionModal.tsx
"use client";

import { getUserPlans, addRestaurantToPlan } from "@/utils/client/plan";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
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
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      const res = await getUserPlans(userId);
      if (!res.anticipate().error) {
        setPlans(res.unwrap().map((p) => ({ id: p.planId, name: p.name })));
      }
      setLoading(false);
    }
    fetchPlans();
  }, [userId]);

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
                disabled={adding}
                onClick={() => handleAdd(plan.id)}
                className="w-full text-left px-4 py-3 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm text-gray-700 disabled:opacity-50"
              >
                {plan.name}
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
