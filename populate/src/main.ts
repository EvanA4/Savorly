import { exit } from "process";
import dbConnect from "./utils/dbconnect";
import { clearDB } from "./utils/cleardb";
import { fillDB } from "./utils/filldb";

// parameters
// const N_REVIEWS = 100;
// const IMG_BOUNDS = [0, 3];
// const TAG_BOUNDS = [0, 3];

async function main() {
  console.log("Connecting to database...");
  const users = process.env.USERS!.split(",");
  console.log(users);

  await dbConnect();
  await clearDB();
  await fillDB();
}

// if you don't exit, ts-node runs indefinitely
main().then(() => exit(0));

/*
TODO
- get list of images for each cuisine
*/
