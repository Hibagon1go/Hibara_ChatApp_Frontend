import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosJWTClient from "../../components/libs/requestAuth";
import { backend } from "../../constants/api";
import styles from "../../styles/Home.module.css";
import ColorfulButton from "../../components/common/ColorfulButton";
import Modal, { Styles } from "react-modal";
import getUserIdFromJWT from "../../components/libs/handlJWT";

import { toast } from "react-toastify";

const ChatRoom: NextPage = () => {
  const router = useRouter();
  const query = router.query;
  const { room_id }: any = query;
  const FETCH_ALL_MSGS_API_URL = `${backend.BACKEND_BASE_URL}/api/msg?chat_room_id=${room_id}`;
  const MSG_API_URL = `${backend.BACKEND_BASE_URL}/api/msg`;

  const [text, setText] = useState("");
  const [editingText, setEditingText] = useState("");
  const [editingMsgID, setEditingMsgID] = useState("");
  const [willEdit, setWillEdit] = useState(false);
  const [refresh_count, setRefreshCount] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userID, setUserID] = useState("");

  interface ChatMsg {
    id: string;
    text: string;
    sender_id: string;
    name: string;
    created_at: string;
    updated_at: string;
  }
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);

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

  const refreshChatMsgs = () => {
    axiosJWTClient.get(FETCH_ALL_MSGS_API_URL).then((res) => {
      setMsgs(res.data);
      console.log(JSON.stringify(res.data));
    });
  };

  useEffect(() => {
    const userIDFromJWT = getUserIdFromJWT(localStorage.getItem("token") || "");
    setUserID(userIDFromJWT);
    if (router.isReady) {
      refreshChatMsgs();
    }
  }, [query, router, refresh_count]);

  const sendMsg = (text: string) => {
    axiosJWTClient
      .post(MSG_API_URL, {
        text: text,
        chat_room_id: room_id,
      })
      .then((res) => {
        setRefreshCount((prevCount) => prevCount + 1);
        setText("");
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const editMsg = (msgID: string, text: string) => {
    axiosJWTClient
      .put(MSG_API_URL, {
        id: msgID,
        text: text,
      })
      .then((res) => {
        toast(res.data.message);
        refreshChatMsgs();
        setModalIsOpen(false);
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const deleteMsg = (msgID: string) => {
    axiosJWTClient
      .delete(MSG_API_URL, {
        data: { id: msgID },
      })
      .then((res) => {
        toast(res.data.message);
        refreshChatMsgs();
        setModalIsOpen(false);
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const openEditMsgModal = () => {
    setModalIsOpen(true);
  };

  const editMsgCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>チャット詳細</title>
          <meta name="description" content="Chat Detail" />
        </Head>

        <main className={styles.main}>
          <div className="text-left cursor-pointer mb-2">
            <Link href="/room">ルーム一覧へ戻る</Link>
          </div>
          {/** メッセージ表示系 */}
          <div>
            <button onClick={refreshChatMsgs}>
              <svg
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                width="30px"
                height="30px"
              >
                <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <div
              id="messages"
              className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            >
              {msgs.map((msg, key) => {
                return (
                  <div key={key} className="chat-message">
                    <div className="text-xs text-gray-500">
                      <a>{msg.name}</a>
                    </div>
                    <div className="flex items-end justify-start">
                      <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1 mx-1"
                      />
                      <div className="flex flex-col space-y-2 text-xs max-w-xs order-2 items-end">
                        <div>
                          <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-blue-600 text-white ">
                            {msg.text}{" "}
                            {msg.created_at != msg.updated_at && "編集済み"}
                          </span>
                        </div>
                      </div>

                      {msg.sender_id === userID && (
                        <div className="order-3 py-2">
                          <img
                            src="/three-point.svg"
                            alt="モーダル開く"
                            className="rotate-90 cursor-pointer hover:opacity-75 w-4 h-4"
                            onClick={() => {
                              setEditingMsgID(msg.id);
                              setEditingText(msg.text);
                              openEditMsgModal();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/** メッセージ送信のinput系 */}
            <div className="grid grid-cols-6">
              <div className="col-span-5">
                <input
                  type="text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="メッセージをここに!"
                  className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                />
              </div>
              <div className="col-span-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    sendMsg(text);
                  }}
                  className="inline-flex text-center mx-2 w-full items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 ml-2 transform rotate-90"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/** メッセージ編集モーダル */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={editMsgCloseModal}
              style={customStyles}
            >
              <div className="grid grid-cols-6">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                    placeholder="編集するメッセージをここに！"
                    className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                  />
                </div>
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      editMsg(editingMsgID, editingText);
                      setModalIsOpen(false);
                    }}
                    className="inline-flex text-center mx-2 w-full items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-6 w-6 ml-2 transform rotate-90"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-right p-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteMsg(editingMsgID);
                    setModalIsOpen(false);
                  }}
                  className="rounded m-2 bg-red-500 hover:bg-red-700 text-white justify-end font-bold py-2 px-4 rounded"
                >
                  削除
                </button>
                <button
                  onClick={editMsgCloseModal}
                  className="rounded m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  閉じる
                </button>
              </div>
            </Modal>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChatRoom;
