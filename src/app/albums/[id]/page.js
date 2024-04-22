'use client'
import Songs from "@/app/components/Songs";
import Album from "@/app/components/Album";
import { useState, useEffect, createContext } from "react";
import RatingBtns from "@/app/components/RatingBtns";
import SaveReviewBtn from "@/app/components/SaveReviewBtn";

export const ToSaveContext = createContext(null);

export default function Page(albumId) {
  let id = albumId.params.id;
  const [album, setAlbum] = useState({});
  const [saved, setSaved] = useState();
  const [pressedNumber, setPressedNumber] = useState(null);

  const [songs, setSongs] = useState([])
  const [songOrder, setSongOrder] = useState([]);
  const [albumRating, setAlbumRating] = useState();

  // use album ID to populate album page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getalbum/'+id, {method: "GET"});
        const responseData = await response.json();
        console.log(responseData);

        setAlbum(responseData[0][0]);
        setSongs(responseData[1]);
        setSongOrder(responseData[2]);

      } catch (error) {
        console.error("Error fetching albums: " + error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <ToSaveContext.Provider value={{ album, songs, setSongs, songOrder, setSongOrder, albumRating, setAlbumRating, saved, setSaved, pressedNumber, setPressedNumber }}>
        <div className="w-full flex flex-col justify-center items-left">
          <div className="w-full flex">
            <div className="flex flex-col w-[60%]">
              <div className="p-3 flex flex-col gap-1">
                <p className="text-lg font-bold">community rating: <span className="text-accent">{album.avg_rating}</span></p>
                {/* <Stars numStars={album.avg_rating} width={25} gap={1.5} /> */}
              </div>
              <Album album={album} />

            </div>
            <div className="flex flex-col w-full items-left mt-[10vh] mx-[5vw] gap-5">
              <p className="text-lg font-bold -mb-4">your rating:</p>
              <RatingBtns />
              <SaveReviewBtn />
              <button className="w-full p-1 rounded-md bg-primary">comments</button>
            </div>
          </div>
          <Songs songs={songs} />
        </div>
      </ToSaveContext.Provider>
    </>
  )
}