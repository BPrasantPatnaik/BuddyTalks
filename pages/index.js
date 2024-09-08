import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createAndJoin = () => {
    const roomId = uuidv4(); //this will create a new room with a unique id random

    router.push(`/${roomId}`); // this is how we navigate to a new room
  };

  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`);
    else {
      alert("Please provide a valid room id");
    }
  };


  //this only for changing background image
  const [isSmallOrMedium, setIsSmallOrMedium] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallOrMedium(window.innerWidth < 1000); // Assuming 768px is the breakpoint for medium
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const imageSrc = isSmallOrMedium 
    ? 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    : 'https://images.pexels.com/photos/1128334/pexels-photo-1128334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';


  return (
    <div>
      <Image
        src={imageSrc}
        width={300} height={100} alt=""
        className={`w-screen ${isSmallOrMedium? "h-fit":"h-full"} blur-sm`}
      />
      <div className="absolute top-[10%]">
      <span className="max-w-screen h-fit flex justify-center items-center">
            <Image src="/Logo.png" alt="BuddyTalks Logo" width={300} height={100} className={isSmallOrMedium? "hidden":"w-[15%] absolute left-[5%]"}/>
            <h1 className={`${isSmallOrMedium? "text-[5vw]":"text-6xl"} text-gray-300 font-serif font-bold underline`}>BuddyTalks</h1>
      </span>
        
        <div className={`font-serif ${isSmallOrMedium? "text-[3vw]":"text-[2vw]"} text-gray-200 text-[1.5vw] mx-[10%] my-[5%] justify-center items-center relative top-[5%]`}>
          Welcome to BuddyTalks – your go-to video chat platform designed for
          seamless communication and connection with friends, family, and
          colleagues. Whether you’re catching up with loved ones, collaborating
          on projects, or meeting new people, BuddyTalks offers a user-friendly
          interface, high-quality video and audio, and secure connections. Enjoy
          features like group chats, customizable backgrounds, and easy screen
          sharing, all from the comfort of your browser. Join BuddyTalks today
          and start making meaningful connections – face-to-face, no matter the
          distance!
        </div>
        <div className="w-[80%] py-[5%] bg-gray-500 bg-opacity-40 mx-auto   rounded text-white flex flex-col items-center">
          <div className="flex flex-col items-center mt-3 w-full">
            <input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e?.target?.value)}
              className={`text-black ${isSmallOrMedium? "text-[3vw]":"text-[2vw]"} p-1 rounded w-9/12 mb-3`}
            />
            <button
              onClick={joinRoom}
              className={`bg-buttonPrimary ${isSmallOrMedium? "text-[3vw]":"text-[2vw]"} py-2 px-4 rounded hover:bg-red-700`}
            >
              Join Room
            </button>
          </div>
          <span className={`my-3 ${isSmallOrMedium? "text-[3vw]":"text-xl"}`}>
            --------------- OR ---------------
          </span>
          <button
            onClick={createAndJoin}
            className={`bg-buttonPrimary ${isSmallOrMedium? "text-[3vw]":"text-[2vw]"} py-2 px-4 rounded hover:bg-red-700`}
          >
            Create a new room
          </button>
        </div>
      </div>
    </div>
  );
}
