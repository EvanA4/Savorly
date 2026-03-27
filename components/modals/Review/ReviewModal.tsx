"use client";
import React, { useEffect, useState } from "react";
import Modal from "../../general/Modal";
import FileUploader from "../../forms/FileUploader";
import TagSelect from "./TagSelect";
import { PopulatedReview } from "@/types/review";
import Image from "next/image";
import { createReview, updateReview } from "@/utils/client/review";
import { ReviewDocument } from "@/models/Review";
import imageCompression from "browser-image-compression";

async function shrinkFile(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}

function ReviewModal(props: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  review?: PopulatedReview;
  setReview: React.Dispatch<React.SetStateAction<PopulatedReview | undefined>>;
  setReviews: React.Dispatch<React.SetStateAction<ReviewDocument[]>>;
  restaurantId: string;
  userId: string;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [titleInput, setTitleInput] = useState<string>("");
  const [descInput, setDescInput] = useState<string>("");
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<number>(0);
  const [imagesInput, setImagesInput] = useState<File[]>([]);
  const [prevImagesInput, setPrevImagesInput] = useState<boolean[]>([]);

  useEffect(() => {
    if (props.review) {
      setTitleInput(props.review.title);
      setTags(props.review.tags.map((val) => val.label as unknown as string));
      setDescInput(props.review.description);
      setRatingInput(props.review.rating);
      setBudgetInput(props.review.budget);
      setPrevImagesInput(Array(props.review.images.length).fill(true));
    }
  }, [props.review]);

  async function handleSubmit() {
    const src = {
      restaurantId: props.restaurantId,
      title: titleInput,
      description: descInput,
      rating: ratingInput,
      budget: budgetInput,
      tags: tags,
      imagesToCreate: imagesInput,
    };

    let rev: PopulatedReview; // temporary review object
    if (props.userId && props.restaurantId) {
      if (!props.review) {
        const res = await createReview(props.userId, src);
        const rerr = res.anticipate();
        if (rerr.error) {
          console.log(rerr.message);
        } else {
          rev = res.unwrap();
          props.setReview(res.unwrap());
          props.setReviews((prev) => [
            ...prev,
            {
              _id: rev._id,
              restaurantId: props.restaurantId,
              title: titleInput,
              description: descInput,
              rating: ratingInput,
              budget: budgetInput,
            } as ReviewDocument,
          ]);
        }
      } else {
        const res = await updateReview({
          _id: props.review._id.toString(),
          ...src,
          imagesToDelete: props.review.images.filter(
            (_, idx) => !prevImagesInput[idx],
          ),
        });
        const rerr = res.anticipate();
        if (rerr.error) {
          console.log(rerr.message);
        } else {
          rev = res.unwrap();
          setPrevImagesInput(Array(rev.images.length).fill(true));
          setImagesInput([]);
          props.setReview(rev);

          props.setReviews((prev) =>
            prev.map((val) =>
              val._id.toString() !== rev._id.toString()
                ? val
                : ({
                    _id: rev._id,
                    restaurantId: props.restaurantId,
                    title: titleInput,
                    description: descInput,
                    rating: ratingInput,
                    budget: budgetInput,
                  } as ReviewDocument),
            ),
          );
        }
      }

      props.setVisible(false);
    }
  }

  return (
    <Modal visible={props.visible} setVisibile={props.setVisible} centered>
      <div className="w-[95vw] md:w-[80vw] 3xl:w-[50vw] max-h-[90vh] overflow-scroll bg-white shadow-xl rounded-xl border border-neutral-300 p-5 flex flex-col gap-5 overflow-x-hidden">
        <p className="text-xl text-center">Create Review</p>
        <input
          className="bg-white shadow-md p-3 w-full rounded-lg border border-neutral-300"
          placeholder="Title"
          onChange={(e) => setTitleInput(e.target.value)}
          value={titleInput}
        />
        <textarea
          className="bg-white resize-none shadow-md p-3 w-full rounded-lg border border-neutral-300 min-h-20"
          placeholder="Description"
          onChange={(e) => setDescInput(e.target.value)}
          value={descInput}
        />
        <input
          type="number"
          className="bg-white shadow-md p-3 w-full rounded-lg border border-neutral-300"
          placeholder="Rating"
          onChange={(e) => setRatingInput(parseFloat(e.target.value))}
          value={ratingInput}
        />
        <input
          type="number"
          className="bg-white shadow-md p-3 w-full rounded-lg border border-neutral-300"
          placeholder="Budget"
          onChange={(e) => setBudgetInput(parseFloat(e.target.value))}
          value={budgetInput}
        />
        <TagSelect tags={tags} setTags={setTags} />

        <div>
          {props.review && (
            <div className="flex gap-1 mb-1">
              {prevImagesInput.map((val, idx) => (
                <div
                  key={idx}
                  className={
                    "flex gap-3 px-3 py-1 bg-neutral-200 rounded-xl " +
                    (val ? "" : "line-through")
                  }
                >
                  {props.review!.images[idx]?.name}
                  <button
                    onClick={() =>
                      setPrevImagesInput((prev) => {
                        const output = [...prev];
                        output[idx] = !output[idx];
                        return output;
                      })
                    }
                  >
                    <Image
                      src="/svgs/btrash.svg"
                      width={16}
                      height={16}
                      alt="close"
                      className="opacity-50 hover:opacity-70 cursor-pointer"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          <FileUploader
            onUpload={async (files) => {
              const compressed: File[] = [];
              for (let i = 0; i < files.length; ++i) {
                compressed.push(await shrinkFile(files[i]));
              }
              setImagesInput(compressed);
            }}
            allowedTypes={["png", "jpg", "jpeg", "JPG", "JPEG"]}
            multipleFiles
          />
        </div>

        <div className="flex justify-end">
          <button
            className="px-3 py-2 bg-blue-200 hover:bg-blue-300 rounded-lg"
            onClick={() => handleSubmit()}
          >
            {props.review ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ReviewModal;
