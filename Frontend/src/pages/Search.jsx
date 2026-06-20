import React, { useState, useEffect } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ImSearch } from "react-icons/im";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSearchdata } from "../redux/userSlice";
import dp from "../assets/DP.webp";

const Search = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { searchData } = useSelector((state) => state.user);

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/user/search?keyWord=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchdata(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!input) {
      dispatch(setSearchdata([]));
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="w-full h-[60px] flex items-center justify-center relative">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-[800px] h-full rounded-full bg-[#0f1414] flex items-center px-[30px]"
        >
          <ImSearch className="w-[25px] h-[25px] text-white" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full px-5 text-white font-semibold text-[20px] outline-0"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
      </div>

      <div className="w-full max-w-[800px] flex flex-col gap-[15px] px-[20px]">
        {searchData?.map((user, idx) => (
          <div
            key={user?._id || idx}
            className="w-full flex items-center gap-[15px] cursor-pointer"
            onClick={() => navigate(`/profile/${user?.username}`)}
          >
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-700 shrink-0">
              <img
                src={user?.profilePicture || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold">{user?.username}</span>
              <span className="text-gray-400 text-sm">{user?.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;