import Rating from "@mui/material/Rating";

type CollectionItemProps = {
  RestaurantName: string;
};
export default function CollectionItem({
  RestaurantName,
}: CollectionItemProps) {
  const rating = 2.5; //also query eventually
  return (
    <div className="ml-6 flex items-center justify-between rounded-lg border hover:shadow-sm transition-all">
      <span className="flex-1 min-w-0 p-3 text-lg truncate">
        {RestaurantName}
      </span>
      <div className="ml-2 pr-3 shrink-0 md:pr-7">
        <Rating readOnly value={2.5} precision={0.5} />
      </div>
    </div>
  );
}
