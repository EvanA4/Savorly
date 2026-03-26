import { exit } from "process";
import dbConnect from "./utils/dbconnect";
import { clearDB } from "./utils/cleardb";
import { fillDB } from "./utils/filldb";
import { config } from "dotenv";
config();

async function main() {
  console.log("Connecting to database...");
  await dbConnect();

  // clear database
  console.log("Clearing database...");
  const clearRes = await clearDB();
  let rerr = clearRes.anticipate();
  console.log(rerr.message);
  if (rerr.error) return;
  console.log(`Deleted ${clearRes.unwrap()} documents!`);

  // fill database
  console.log("Populating database...");
  const fillRes = await fillDB();
  rerr = fillRes.anticipate();
  console.log(rerr.message);
  if (!rerr.error) {
    console.log(`Successfully created ${fillRes.unwrap()} reviews!`);
  }
}

// if you don't exit, ts-node runs indefinitely
main().then(() => exit(0));
