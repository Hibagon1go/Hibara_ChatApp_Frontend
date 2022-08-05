import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ColorfulButton from "../common/ColorfulButton";

const SignUp: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const SIGNUP_URL = "https://uttc-chat-backend-2hm5jnzxea-an.a.run.app/signup";
  const ROOM_LIST_PATH = "/room";

  const signUpHandler = () => {
    axios
      .post(SIGNUP_URL, { email: email, password: password, name: name })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        router.push(ROOM_LIST_PATH);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8">
          Welcome to ChatApp
        </h2>

        <form className="max-w-lg border rounded-lg mx-auto">
          <div className="flex flex-col gap-4 p-4 md:p-8">
            <div>
              <label
                htmlFor="username"
                className="inline-block text-gray-800 text-sm sm:text-base mb-2"
              >
                ユーザ名
              </label>
              <input
                name="username"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="inline-block text-gray-800 text-sm sm:text-base mb-2"
              >
                メールアドレス
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                className="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="inline-block text-gray-800 text-sm sm:text-base mb-2"
              >
                パスワード
              </label>
              <input
                name="password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
              />
            </div>

            <ColorfulButton onClick={signUpHandler} buttonText="登録する" />
          </div>

          <div className="flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
            <p className="text-white text-sm text-center">
              すでにアカウントがある場合は{" "}
              <Link href="/">
                <a className="text-white text-sm">ログイン</a>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
