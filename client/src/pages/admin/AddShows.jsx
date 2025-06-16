import { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { Title } from "../../components/admin-component/Title";
import { CheckIcon, StarIcon, XIcon } from "lucide-react";
import { KConverter } from "../../lib/KConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";


const AddShows = () => {
  const {axios, getToken, user, image_base_url} = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false)

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success) setNowPlayingMovies(data.movies)
    } catch (error) {
      console.error('Error fetching movies: ', error)
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });

    setDateTimeInput(""); // clear after adding
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const handleSubmit = async() => {
    try {
      setAddingShow(true)
      if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 ||!showPrice){
        return toast('Missing required fields')
      }
      const showsInput = Object.entries(dateTimeSelection).map(([date, time])=>({date, time}))
      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      }
      const { data } = await axios.post('/api/show/add', payload, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){
        toast.success(data.message)
        setSelectedMovie(null)
        setDateTimeSelection({})
        setShowPrice('')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Submission error: ', error)
      toast.error('An error occurred. Please try again')
    }
    setAddingShow(false)
  }

  useEffect(() => {
    if(user) fetchNowPlayingMovies();
  }, [user]);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Movies" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      {/* Movies List */}
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 ${
                selectedMovie === movie.id ? "border border-primary" : ""
              }`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={image_base_url + movie.poster_path}
                  alt="poster"
                  className="w-full object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">
                    {KConverter(movie.vote_count)} Votes
                  </p>
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

      {/* Show Price Input */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            type="number"
            min={0}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter each ticket price"
            className="outline-none bg-transparent text-white"
          />
        </div>
      </div>

      {/* Date & Time Input */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex items-center gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md bg-transparent text-white"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary"
          >
            Add Time
          </button>
        </div>
      </div>

      {/* 🆕 Selected Date-Time Display Section */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Selected Show-Time</h3>
          <div className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <div key={date}>
                <p className="text-gray-300 font-medium mb-1">{date}</p>
                <div className="flex flex-wrap gap-2">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full text-sm text-white"
                    >
                      <span>{time}</span>
                      <XIcon
                        className="w-4 h-4 cursor-pointer hover:text-red-400"
                        onClick={() => handleRemoveTime(date, time)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button 
      onClick={handleSubmit}
      disabled={addingShow}
      className="bg-primary text-white px-8 py-2 mt-6 rounded transition-all cursor-pointer hover:bg-primary/90">
        Add Show
      </button>
    </>
  ) : (
    <Loading />
  );
};

export default AddShows;
