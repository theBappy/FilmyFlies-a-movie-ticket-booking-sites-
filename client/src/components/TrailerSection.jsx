import React, { useState } from "react";
import { dummyShowsData } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyShowsData[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleThumbnailClick = (trailer) => {
    setCurrentTrailer(trailer);
    setIsPlaying(false); // reset to show preview
  };

  const handlePlayClick = () => {
    setIsPlaying(true); // start playing
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>

      {/* Video Player Section */}
      <div
        className="relative mt-6 max-w-[960px] mx-auto rounded-lg overflow-hidden"
        style={{ paddingTop: "56.25%" }} // 16:9 aspect ratio
      >
        <BlurCircle top="-100px" right="-100px" />

        {!isPlaying ? (
          // SHOW PREVIEW IMAGE with play icon
          <div
            className="absolute top-0 left-0 w-full h-full cursor-pointer"
            onClick={handlePlayClick}
          >
            <img
              src={currentTrailer.poster_path}
              alt={currentTrailer.title}
              className="w-full h-full object-cover brightness-75 rounded-lg"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-16 h-16 text-white drop-shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200"
            />
          </div>
        ) : (
          // SHOW ReactPlayer playing video starting at 15 seconds, no light mode
          <ReactPlayer
            url={currentTrailer.videoUrl}
            playing={true}
            controls={true}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
            config={{
              youtube: {
                playerVars: {
                  start: 5, 
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  controls: 1,
                  disablekb: 0,
                },
              },
            }}
            onEnded={() => setIsPlaying(false)} // reset to preview when ended
          />
        )}
      </div>

      <div className="text-center mt-4 text-white max-w-[960px] mx-auto">
        <h2 className="text-2xl font-semibold">{currentTrailer.title}</h2>
        <p className="text-gray-400 text-sm">{currentTrailer.release_date}</p>
      </div>

      {/* Thumbnail Trailers */}
      <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-4xl mx-auto">
        {dummyShowsData.slice(0, 4).map((trailer) => (
          <div
            key={trailer._id}
            onClick={() => handleThumbnailClick(trailer)}
            className={`relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 max-md:w-60 cursor-pointer rounded-lg overflow-hidden ${
              currentTrailer._id === trailer._id ? "ring-2 ring-white" : ""
            }`}
          >
            <img
              src={trailer.poster_path}
              alt={trailer.title}
              className="w-full h-full object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-5 md:w-8 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
