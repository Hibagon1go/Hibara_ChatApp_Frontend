import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosJWTClient from "../../components/libs/requestAuth";
import { backend } from "../../constants/api";
import styles from "../../styles/Home.module.css";

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
  interface ChatMsg {
    id: string;
    text: string;
    name: string;
    created_at: string;
    updated_at: string;
  }
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      id: "",
      text: "",
      name: "",
      created_at: "",
      updated_at: "",
    },
  ]);

  useEffect(() => {
    if (router.isReady) {
      axiosJWTClient.get(FETCH_ALL_MSGS_API_URL).then((res) => {
        setMsgs(res.data);
        console.log(JSON.stringify(res.data));
      });
    }
  }, [query, router]);

  const sendMsg = (text: string) => {
    axiosJWTClient
      .post(MSG_API_URL, {
        text: text,
        chat_room_id: room_id,
      })
      .then((res) => {
        console.log(JSON.stringify(res.data));
      });
  };

  const editMsg = (msgID: string, text: string) => {
    axiosJWTClient
      .put(MSG_API_URL, {
        id: msgID,
        text: text,
      })
      .then((res) => {
        console.log(JSON.stringify(res.data));
      });
  };

  const deleteMsg = (msgID: string) => {
    axiosJWTClient
      .delete(MSG_API_URL, {
        data: { ID: msgID },
      })
      .then((res) => {
        console.log(JSON.stringify(res.data));
      });
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>チャット詳細</title>
          <meta name="description" content="Chat Detail" />
        </Head>

        <main className={styles.main}>
          {/** メッセージ表示系 */}
          <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <div
              id="messages"
              className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            >
              {msgs.map((msg, key) => {
                const isMine = key % 2 === 0; // FIXME:const isMine = msg.name === hogehoge_name; // TODO: 自分のnameがわからん
                const justifyEndOrStart = isMine
                  ? "justify-end"
                  : "justify-start";
                return (
                  <div key={key} className="chat-message">
                    <div className={`flex items-end ${justifyEndOrStart}`}>
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                          <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                            {msg.text}{" "}
                            {msg.created_at != msg.updated_at && "編集済み"}
                          </span>
                        </div>
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-2"
                      />
                      <a>{msg.name}</a>
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
          </div>
        </main>
      </div>
    </>
  );
};

export default ChatRoom;
