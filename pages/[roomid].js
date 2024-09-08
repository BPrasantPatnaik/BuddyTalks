import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";

import Player from "@/component/Player";
import Bottom from "@/component/Bottom";
import CopySection from "@/component/CopySection";

import styles from "@/styles/room.module.css";
import { useRouter } from "next/router";
import Image from "next/image";

const Room = () => {
  const socket = useSocket();
  const roomId = useRouter().query.roomid;
  console.log("this is in the roomId section so the room id=", roomId);
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream(); //i ll get the stream i.e. a string of data from the user

  const [isTouched, setIsTouched] = useState(false); //this is to ensure that the user has touched small right top screen or not

  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    //this is for the other peer members of the room and make a call to the new user
    if (!socket || !peer || !stream) return;

    const handleUserConnected = (newUser) => {
      // console.log("running the function handleUserConnected")
      console.log(`user connected in room with userId ${newUser}`);

      const call = peer.call(newUser, stream); // sending the stream of data from this user to the new user (kisko call karna hai, kya bhejna hai)

      call.on("stream", (incomingStream) => {
        //receiving any incoming stream from the new user
        console.log(`incoming stream from ${newUser}`);
        setPlayers((prev) => ({
          //kisiko agar call krega toh usko bhi player mei add krenge
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newUser]: call,
        }));
      });
    };

    socket.on("new-user-connected", handleUserConnected); //this comes from the server side with a new user id

    return () => {
      socket.off("new-user-connected", handleUserConnected);
    };
  }, [peer, setPlayers, socket, stream]);

  useEffect(() => {
    //this is for the new user to receive the call and send and receive the stream of data
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          //koi agar call krega toh usko bhi player mei add krenge
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        console.log(copy[userId]);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [players, setPlayers, socket, users]);

  useEffect(() => {
    //sabse pehle ham apne aap ko add karenge as a player
    if (!stream || !myId) return;
    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  //this only for changing background image
  const [isSmallOrMedium, setIsSmallOrMedium] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallOrMedium(window.innerWidth < 1000); // Assuming 768px is the breakpoint for medium
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const imageSrc = isSmallOrMedium
    ? "https://images.pexels.com/photos/26937329/pexels-photo-26937329/free-photo-of-night-sky-with-milky-way-over-a-rural-landscape.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    : "https://images.pexels.com/photos/27665869/pexels-photo-27665869/free-photo-of-the-sun-sets-over-a-city-and-a-mountain.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <>
      <div>
        <div className="">
          <Image
            src={imageSrc}
            alt=""
            width={300}
            height={100}
            className={`w-screen h-screen blur-md`}
          />
        </div>

        <div>
          <div className={styles.activePlayerContainer}>
            {playerHighlighted && (
              <Player
                url={playerHighlighted.url}
                muted={playerHighlighted.muted}
                playing={playerHighlighted.playing}
                isActive
              />
            )}
          </div>
          <div className={styles.inActivePlayerContainer}>
            {Object.keys(nonHighlightedPlayers).map((playerId) => {
              const { url, muted, playing } = nonHighlightedPlayers[playerId];
              return (
                <Player
                  key={playerId}
                  url={url}
                  muted={muted}
                  playing={playing}
                  isActive={false}
                />
              );
            })}
          </div>
          
          <CopySection roomId={roomId} />

          <Bottom
            muted={playerHighlighted?.muted}
            playing={playerHighlighted?.playing}
            toggleAudio={toggleAudio}
            toggleVideo={toggleVideo}
            leaveRoom={leaveRoom}
          />
        </div>
      </div>
    </>
  );
};

export default Room;
