import CollectionItem from "./CollectionItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

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
      <Accordion className="w-full">
        <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
          <div className="flex w-full items-center justify-between">
            <span className="text-xl">{name}</span>
            <IconButton
              className="!pr-3"
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
          {...restaurant_list}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
