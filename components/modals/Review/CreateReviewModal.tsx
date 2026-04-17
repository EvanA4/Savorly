"use client";
import React, { useEffect, useState } from "react";
import Modal from "../../general/Modal";
import FileUploader from "../../forms/FileUploader";
import TagSelect from "./TagSelect";
import { PopulatedReview } from "@/types/review";
import Image from "next/image";
import { createReview, updateReview } from "@/utils/client/review";
import imageCompression from "browser-image-compression";
import BudgetSelect from "./BudgetSelect";
import RatingSelect from "./RatingSelect";

async function shrinkFile(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}

function CreateReviewModal(props: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  restaurantId: string;
  userId: string;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [titleInput, setTitleInput] = useState<string>("");
  const [descInput, setDescInput] = useState<string>("");
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<number>(2);
  const [imagesInput, setImagesInput] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
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
      const res = await createReview(props.userId, src);
      const rerr = res.anticipate();
      if (rerr.error) {
        console.log(rerr.message);
      } else {
        rev = res.unwrap();
      }
      props.setVisible(false);
    }
    setSubmitting(false);
  }

  return (
    <Modal visible={props.visible} setVisibile={props.setVisible} centered>
      <div className="w-[95vw] md:w-[80vw] 3xl:w-[50vw] max-h-[90vh] overflow-scroll bg-white shadow-xl rounded-xl border border-neutral-300 p-5 flex flex-col gap-5 overflow-x-hidden relative">
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
        <RatingSelect
          ratingInput={ratingInput}
          setRatingInput={setRatingInput}
        />
        <BudgetSelect
          budgetInput={budgetInput}
          setBudgetInput={setBudgetInput}
        />
        <TagSelect tags={tags} setTags={setTags} />

        <div>
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
            className={
              "px-3 py-2 bg-blue-200 hover:bg-blue-300 rounded-lg " +
              (submitting && " opacity-50")
            }
            onClick={handleSubmit}
            disabled={submitting}
          >
            Submit
          </button>
        </div>

        <button
          className="absolute top-0 right-0 p-5 cursor-pointer"
          onClick={() => props.setVisible(false)}
        >
          <Image
            src="/svgs/close.svg"
            alt="close modal"
            width={0}
            height={0}
            className="w-5 h-auto object-contain"
          />
        </button>
      </div>
    </Modal>
  );
}

export default CreateReviewModal;
