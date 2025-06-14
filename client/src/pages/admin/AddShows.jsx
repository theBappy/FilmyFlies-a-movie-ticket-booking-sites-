import { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { Title } from "../../components/admin-component/Title";
import { CheckIcon, StarIcon } from "lucide-react";
import { KConverter } from "../../lib/KConverter";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, seNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  const fetchNowPlayingMovies = async () => {
    seNowPlayingMovies(dummyShowsData);
  };
  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Movies" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.poster_path}
                  alt="poster"
                  className="w-full object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">{KConverter(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>
      {/* show price input */}
      <div className="mt-8">
          <label className="block text-sm font-medium mb-2">Show Price</label>
          <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py2 rounded-md">
            <p className="text-gray-400 text-sm">
                {currency}
            </p>
            <input type="number" min={0} value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="Enter each ticket price" className="outline-none" />
          </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default AddShows;
