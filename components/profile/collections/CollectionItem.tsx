import Rating from "../../rest/Rating";
import Link from "next/link";

type CollectionItemProps = {
  RestaurantId: string;
  RestaurantName: string;
  RestaurantRating: number;
};
export default function CollectionItem({
  RestaurantId,
  RestaurantName,
  RestaurantRating,
}: CollectionItemProps) {
  return (
    <Link href={`/restaurant?id=${RestaurantId}`}>
      <div className="ml-6 flex items-center justify-between rounded-lg border hover:shadow-sm transition-all">
        <span className="flex-1 min-w-0 p-3 text-lg truncate">
          {RestaurantName}
        </span>
        <div className="ml-2 pr-3 shrink-0 md:pr-7">
          <Rating value={RestaurantRating} />
        </div>
      </div>
    </Link>
  );
}
