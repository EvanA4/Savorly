import { readFileSync } from "fs";
import { BAD_TITLE_DESCS, GOOD_TITLE_DESCS, RESTS } from "./consts";
import { randpick } from "./rand";
import { randomInt } from "crypto";
import { Review } from "../types/review";
import { createReview } from "./review";
import { Result } from "../types/results";

function getFile(restaurantId: string, num: number) {
  // num must be in range [0, 4]
  const data = readFileSync(`images/${restaurantId}/${num}.jpg`);
  return new File([data], "0.jpg");
}

export async function fillDB(): Promise<Result<number>> {
  try {
    let numCreated = 0;
    const USERS = process.env.USERS!.split(",");
    const IS_REVIEW_GOOD = [true, true, true, true, true, false, false];
    const TAGS = ["Vegan", "Vegetarian", "Gluten-free", "Dairy-free"];
    const IMG_NUMS = [0, 1, 2, 3, 4];

    // for each restaurant...
    for (let i = 0; i < RESTS.length; ++i) {
      // generate 5 reviews
      // create random list of good and bad bools
      const irgs = randpick(IS_REVIEW_GOOD, 5);
      const uids = randpick(USERS, 5);
      let numGood = 0;
      let numBad = 0;

      // for each of five ratings
      for (let j = 0; j < irgs.length; ++j) {
        const rating = irgs[j] ? randomInt(6, 11) / 2 : randomInt(2, 6) / 2;
        const budget = randomInt(3) + 1;
        let tags: string[] = [];
        if (Math.random() > 2 / 3) {
          // occasionally pick a random tag or two
          tags = randpick(TAGS, randomInt(2) + 1);
        }
        const images = randpick(IMG_NUMS, randomInt(3)).map((val) =>
          getFile(RESTS[i].mapboxId, val),
        );
        const reviewStrs = irgs[j]
          ? GOOD_TITLE_DESCS[i][numGood]
          : BAD_TITLE_DESCS[i][numBad];
        if (irgs[j]) ++numGood;
        else ++numBad;

        const toUpload: Review = {
          restaurantId: RESTS[i].mapboxId,
          title: reviewStrs.title,
          description: reviewStrs.description,
          rating: rating,
          budget: budget,
          userId: uids[j],
        };

        // actually start uploading things now
        // review
        const createRes = await createReview(uids[j], {
          ...toUpload,
          tags: tags,
          imagesToCreate: images,
        });
        const rerr = createRes.anticipate();
        if (rerr.error) {
          console.log(rerr.message);
          return new Result({
            error: true,
            message: "Failed to create review.",
          });
        }
        ++numCreated;
      }
    }

    return new Result({
      error: false,
      message: "Successfully filled the database!",
      value: numCreated,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<number>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to fetch movies.",
    });
  }
}
