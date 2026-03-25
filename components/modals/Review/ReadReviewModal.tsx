"use client";
import React, { useEffect, useState } from "react";
import Modal from "../../general/Modal";
import { PopulatedReview } from "@/types/review";
import { getUserById } from "@/utils/client/users";
import { MAPIUser } from "@/types/auth0/mapi_user";
import Image from "next/image";
import Rating from "@/components/rest/Rating";
import { getRestaurantById } from "@/utils/client/restaurant";
import { Restaurant } from "@/types/restaurant";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

function ReadReviewModal(props: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  review: PopulatedReview;
}) {
  const [user, setUser] = useState<MAPIUser | undefined>(undefined);
  const [rest, setRest] = useState<Restaurant | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const userRes = await getUserById(props.review.userId);
      if (userRes) setUser(userRes);
      const restRes = await getRestaurantById(props.review.restaurantId);
      const rerr = restRes.anticipate();
      if (rerr.error) {
        console.log(`Error: failed to get restaurant details: ${rerr.message}`);
      } else {
        setRest(restRes.unwrap());
      }
    })();
  }, []);

  return (
    <Modal visible={props.visible} setVisibile={props.setVisible} centered>
      <div className="w-[95vw] md:w-[80vw] 3xl:w-[50vw] max-h-[90vh] overflow-scroll bg-white shadow-xl rounded-xl border border-neutral-300 py-5 flex flex-col overflow-x-hidden">
        {user && (
          <div className="flex gap-3 px-5">
            {user && user.picture ? (
              <Image
                src={user.picture ?? ""}
                alt={user.name ?? ""}
                width={100}
                height={100}
                priority
                className="h-15 w-auto object-contain rounded-full"
              />
            ) : (
              <Image
                src="/profile.png"
                alt="default profile"
                width={128}
                height={128}
                priority
                className="h-full w-auto object-contain rounded-full opacity-70"
              />
            )}
            <div>
              <p>{user.name}</p>
              <p className="text-neutral-500">{user.email}</p>
            </div>
          </div>
        )}
        <div className="mt-2 px-5">
          <Rating value={props.review.rating} />
        </div>

        <p className="text-xl mt-5 px-5">{props.review.title}</p>
        {rest && (
          <Link href={`/restaurant?id=${props.review.restaurantId}`}>
            <p className="text-neutral-500 px-5">
              for <span className="text-blue-500 underline">{rest.name}</span>
            </p>
          </Link>
        )}
        <p className="text-neutral-700 mt-3 px-5">{props.review.description}</p>

        <div className="flex flex-wrap gap-1 my-5 px-5">
          {props.review.tags.map((val, idx) => (
            <div
              key={idx}
              className="px-3 py-1 bg-neutral-200 rounded-xl flex justify-between gap-2"
            >
              {val.label}
            </div>
          ))}
        </div>

        <div className="w-full">
          <Swiper
            // install Swiper modules
            modules={[Navigation, Scrollbar, A11y]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
          >
            {props.review.images.map((val, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full flex justify-center items-center">
                  <Link href={`/api/images?_id=${val._id!.toString()}`}>
                    <Image
                      src={`/api/images?_id=${val._id!.toString()}`}
                      width={0}
                      height={0}
                      alt="restaurant pic"
                      unoptimized
                      priority
                      className="w-50 h-50 object-cover rounded-2xl overflow-hidden"
                      key={idx}
                    />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Modal>
  );
}

export default ReadReviewModal;
