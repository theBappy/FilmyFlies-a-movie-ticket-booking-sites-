import React from "react";
import { ClockIcon, Calendar, ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/bg.jpg")] bg-cover bg-center h-screen'>
      <img src="/marvel.png" alt="logo" className="max-h-11 lg:h-11 mt:20" />
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold maw-w-110">
        Guardians <br /> of the Galaxy
      </h1>
      <div className="flex items-center gap-4 text-gray-300">
        <span className="">Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <Calendar className="w-4.5 h-4.5" /> 2018
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4.5 h-4.5" /> 2h 8m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis excepturi
        aperiam corrupt obcaecati quo eligendi alias maiores, porro dolorem
        molestias.
      </p>
      <button
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        onClick={() => navigate("/movies")}
      >
        Explore Movies <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
