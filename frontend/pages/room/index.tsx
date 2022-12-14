import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal, { Styles } from "react-modal";
import RoomCard from "../../components/chat/RoomCard";
import ColorfulButton from "../../components/common/ColorfulButton";
import axiosJWTClient from "../../components/libs/requestAuth";
import { backend } from "../../constants/api";
import styles from "../../styles/Home.module.css";
import { toast } from "react-toastify";

Modal.setAppElement("#__next");

const RoomList: NextPage = () => {
  const router = useRouter();
  const BUILD_ROOM_API_URL = `${backend.BACKEND_BASE_URL}/api/chatroom/build`;
  const JOIN_NEW_ROOM_API_URL = `${backend.BACKEND_BASE_URL}/api/chatroom/join`;
  const FETCH_ALL_ROOMS_API_URL = `${backend.BACKEND_BASE_URL}/api/chatroom/all`;
  const FETCH_JOINING_ROOM_API_URL = `${backend.BACKEND_BASE_URL}/api/chatroom/joining`;
  const Leave_ROOM_API_URL = `${backend.BACKEND_BASE_URL}/api/chatroom/leave`;
  const ROOM_PATH = "/room/";
  const [newRoomName, setNewRoomName] = useState("");
  const [buildRoomModalIsOpen, setBuildRoomIsOpen] = useState(false);
  const [joinRoomModalIsOpen, setJoinRoomIsOpen] = useState(false);

  interface JoiningRoom {
    chat_room_id: string;
    name: string;
  }

  interface ChatRoom {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  }

  const [joiningRooms, setJoiningRooms] = useState<JoiningRoom[]>([]);

  const [allRooms, setAllRooms] = useState<ChatRoom[]>([]);

  const customStyles: Styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
    },

    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: "500px",
      height: "300px",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    axiosJWTClient.get(FETCH_JOINING_ROOM_API_URL, {}).then((res) => {
      setJoiningRooms(res.data);
    });
  }, []);

  const buildChatRoom = () => {
    axiosJWTClient
      .post(BUILD_ROOM_API_URL, {
        room_name: newRoomName,
      })
      .then((res) => {
        router.push(ROOM_PATH + res.data.chat_room_id);
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const joinNewRoom = (chatRoomID: string) => {
    axiosJWTClient
      .post(JOIN_NEW_ROOM_API_URL, {
        chat_room_id: chatRoomID,
      })
      .then((res) => {
        toast(res.data.message);
        router.push(ROOM_PATH + chatRoomID);
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const fetchAllRooms = () => {
    axiosJWTClient.get(FETCH_ALL_ROOMS_API_URL).then((res) => {
      setAllRooms(res.data);
      console.log(JSON.stringify(res.data));
    });
  };

  const leaveRoom = (chatRoomID: string) => {
    axiosJWTClient
      .delete(Leave_ROOM_API_URL, {
        data: { chat_room_id: chatRoomID },
      })
      .then((res) => {
        toast(res.data.message);
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const openBuildRoomModal = () => {
    setBuildRoomIsOpen(true);
  };

  const buildRoomCloseModal = () => {
    setBuildRoomIsOpen(false);
  };

  const openJoinRoomModal = () => {
    setJoinRoomIsOpen(true);
  };

  const joinRoomCloseModal = () => {
    setJoinRoomIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>?????????????????????</title>
        <meta name="description" content="Room List of you" />
      </Head>

      <main className={styles.main}>
        <h2 className="text-xl md:text-2xl font-bold">?????????????????????</h2>
        <div>
          {joiningRooms.map((joiningRoom, key) => {
            return (
              <div key={key}>
                {/** ??????????????????????????? */}
                <RoomCard
                  isNewRoom={false}
                  room={joiningRoom}
                  leaveRoom={leaveRoom}
                  ROOM_PATH={ROOM_PATH}
                />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <ColorfulButton
              onClick={openBuildRoomModal}
              buttonText="????????????????????????"
            />
          </div>
          <div>
            <ColorfulButton
              onClick={openJoinRoomModal}
              buttonText="??????????????????"
            />
          </div>
        </div>

        {/** ??????????????????????????? */}
        <Modal
          isOpen={buildRoomModalIsOpen}
          onRequestClose={buildRoomCloseModal}
          style={customStyles}
        >
          <div className="flex flex-row; grid grid-cols-4 gap-4">
            <input
              autoFocus={true}
              type="text"
              placeholder="????????????"
              value={newRoomName}
              onChange={(event) => setNewRoomName(event.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline col-start-1 col-end-4"
            />
            <ColorfulButton onClick={buildChatRoom} buttonText="????????????" />
          </div>
          <div className="text-right p-8">
            <button
              onClick={buildRoomCloseModal}
              className="rounded bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded align-content: center;"
            >
              ?????????
            </button>
          </div>
        </Modal>

        {/** ??????????????????????????? */}
        <Modal
          isOpen={joinRoomModalIsOpen}
          onRequestClose={joinRoomCloseModal}
          onAfterOpen={fetchAllRooms}
          style={customStyles}
        >
          {allRooms
            .filter(
              (room) =>
                !joiningRooms.includes({
                  chat_room_id: room.id,
                  name: room.name,
                })
            )
            .map((room, key) => {
              return (
                <div key={key}>
                  {/** ??????????????????????????? */}
                  <RoomCard
                    room={room}
                    joinNewRoom={joinNewRoom}
                    isNewRoom={true}
                    ROOM_PATH={ROOM_PATH}
                  />
                </div>
              );
            })}
          <div className="text-right">
            <button
              onClick={joinRoomCloseModal}
              className="rounded bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              ?????????
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default RoomList;
