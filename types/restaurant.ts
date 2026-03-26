export type Restaurant = {
  mapboxId: string;
  name: string;
  website?: string;
  phone?: string;
  lat: number;
  lng: number;
};

export type RestaurantStats = {
  poiId: string;
  avgRating: number;
  avgBudget: number;
  reviewCount: number;
  imageId: string | null;
};

export const RESTAURANT_TYPES = [
  "African", // african_restaurant
  "American", // american_restaurant
  "Asian", // asian_restaurant
  "Barbeque", // barbeque_restaurant
  "Brazilian", // brazilian_restaurant
  "Breakfast", // breakfast_restaurant
  "Brunch", // brunch_restaurant
  "Buffet", // buffet_restaurant
  "Burger", // burger_restaurant
  "Carribean", // carribean_restaurant
  "Chinese", // chinese_restaurant
  "Creole", // creole_restaurant
  "Cuban", // cuban_restaurant
  "Diner", // diner_restaurant
  "English", // english_restaurant
  "Filipino", // filipino_restaurant
  "French", // french_restaurant
  "German", // german_restaurant
  "Greek", // greek_restaurant
  "Hawaiian", // hawaiian_restaurant
  "Indian", // indian_restaurant
  "Indonesian", // indonesian_restaurant
  "Italian", // italian_restaurant
  "Japanese", // japanese_restaurant
  "Korean Barbeque", // korean_barbeque_restaurant
  "Korean", // korean_restaurant
  "Latin American", // latin_american_restaurant
  "Mediterranean", // mediterranean_restaurant
  "Mexican", // mexican_restaurant
  "Middle Eastern", // middle_eastern_restaurant
  "Noodle", // noodle_restaurant
  "Peruvian", // peruvian_restaurant
  "Pizza", // pizza_restaurant
  "Portuguese", // portuguese_restaurant
  "Ramen", // ramen_restaurant
  "Seafood", // seafood_restaurant
  "Spanish", // spanish_restaurant
  "Sushi", // sushi_restaurants
  "Tapas", // tapas_restaurant
  "Thai", // thai_restaurant
  "Turkish", // turkish_restaurant
  "Vietnamese", // vietnamese_restaurant
];
