import CollectionItem from "./CollectionItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

type CollectionListProps = {
  name: string;
  restaurants: string[]; // restaurant ID's
};

export default function CollectionList({
  name,
  restaurants,
}: CollectionListProps) {
  const restaurant_list = [];
  for (let i = 0; i < (restaurants?.length ?? 0); i++) {
    restaurant_list.push(<CollectionItem RestaurantId={restaurants[i]} />);
  }
  return (
    <div className="w-[90%] md:w-[70%]">
      <Accordion
        className="w-full rounded-xl! shadow-sm! border border-gray-100"
        disableGutters
      >
        <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
          <div className="flex w-full items-center justify-between">
            <span className="text-xl font-medium">{name}</span>
            <IconButton
              className="pr-3! text-gray-400! hover:text-gray-600!"
              onClick={(e) => {
                e.stopPropagation();
                // collection edit modal here?
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
                  This collection is looking a little hungry...
                </p>
                <p className="text-sm">Explore restaurants to get started!</p>
              </div>
            </Link>
          ) : (
            restaurants?.map((id) => (
              <CollectionItem key={id} RestaurantId={id} />
            ))
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
