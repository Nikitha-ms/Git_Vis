import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Octo from "../assets/FemaleOcto.png";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchInput) {
      navigate(`/profile/${searchInput}`);
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-700 p-[5%]">
      <div className="flex rounded-3xl border border-slate-950">
        <div className="w-1/2">
          <img src={Octo} alt="GitHub Octocat" className="w-full h-auto" />
        </div>
        <form
          onSubmit={handleSearch}
          className="w-1/2 flex flex-col justify-center items-center gap-8"
        >
          <h1 className="text-white text-2xl font-bold">
            GitHub Profile Finder
          </h1>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter GitHub username"
            className="w-3/4 p-2 rounded-lg bg-slate-800 text-white outline-none"
          />
          <button
            type="submit"
            className="w-3/4 p-2 mt-2 rounded-lg bg-slate-900 text-white hover:bg-slate-950 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
