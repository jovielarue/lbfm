'use client'
import { useEffect, useState, useLayoutEffect, createContext } from "react";
import Carousel from "./components/Carousel";
import Image from "next/image";
import { redirect } from "next/navigation"; 
import { AuthProvider, useAuth } from "./contexts/Auth";
import { parseCookies } from "./actions/parseCookies";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [display, setDisplay] = useState([]);
  const { loggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('user_id')) {
      router.push('https://lbfm.jahsauce.cloud/login');
    }

    const fetchData = async () => {
      try {
        const response = await fetch('https://lbfm.jahsauce.cloud/api/populatecarousel', {method: "GET"});
        const responseData = await response.json();

        setAlbums(responseData);
        let firstCarouselData = responseData.slice(0, 7);
        let secondCarouselData = responseData.slice(7, 14);
        let thirdCarouselData = responseData.slice(14, 21);
        
        setDisplay(
          <>
            <Carousel items={firstCarouselData} title={"hot albums"} />
            <Carousel items={secondCarouselData} title={"trending songs"} />
            <Carousel items={thirdCarouselData} title={"for you"} />
          </>


        );

      } catch (error) {
        console.error("Error fetching albums: " + error);
      }
    }
    fetchData();
  }, []);

  const handleLogOut = () => {
    Cookies.remove('user_id');
    router.push('/login');
  }
  return (
    <>
      <div className="w-full min-h-screen flex flex-col gap-10 p-3">
        {display}
        <button onClick={handleLogOut} className="p-2 bg-base-dark font-bold text-primary-light">log out</button>
      </div>
    </>
  );
}
