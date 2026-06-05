  import axios from "axios";
  import React, { useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams } from "react-router-dom";
  import { setUserData } from "../redux/userSlice";
  import { setStoryData } from "../redux/storySlice";
  import StorySection from "../components/StorySection";

  const Story = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const {storyData} = useSelector(state=>state.story);
    const handleStory = async () => {
      try {
        const result = await axios.get(
          `http://localhost:8080/api/story/getstoryByUsername/${username}`,
          { withCredentials: true },
        );
        dispatch(setStoryData(result.data[0]));
        console.log(storyData);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      if(username){
      handleStory();
      }
    }, [username]);
    return <div className="w-full h-[100vh] bg-black flex justify-center items-center">
      <StorySection storyData={storyData}></StorySection>
    </div>;
  };

  export default Story;
