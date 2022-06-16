import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Constants, { inputClassName } from "../components/consts";
import axios from "axios";

const UsernameContext = React.createContext({
  username: "",
  setUsername: (_: string) => {},
});
const PasswordContext = React.createContext({
  password: "",
  setPassword: (_: string) => {},
});
const RepeatPasswordContext = React.createContext({
  repeatPassword: "",
  setRepeatPassword: (_: string) => {},
});

function UsernameInput() {
  const { username, setUsername } = React.useContext(UsernameContext);
  return (
    <div>
      <input
        type="text"
        className={inputClassName}
        id="username"
        value={username}
        placeholder="用户名"
        onChange={(event) => setUsername(event.target.value)}
      />
    </div>
  );
}

function PasswordInput() {
  const { password, setPassword } = React.useContext(PasswordContext);
  return (
    <div>
      <input
        type="password"
        className={inputClassName}
        id="password"
        value={password}
        placeholder="密码"
        onChange={(event) => setPassword(event.target.value)}
      />
    </div>
  );
}

function RepeatPasswordInput() {
  const { repeatPassword, setRepeatPassword } = React.useContext(
    RepeatPasswordContext
  );
  return (
    <div>
      <input
        type="password"
        className={inputClassName}
        id="repeatPassword"
        value={repeatPassword}
        placeholder="重复密码"
        onChange={(event) => setRepeatPassword(event.target.value)}
      />
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const router = useRouter();
  const [register, setRegister] = useState(Constants.defaultRegister);
  const [errMsg, setErrMsg] = useState(Constants.defaultErrMsg);

  function ErrMsg() {
    if (errMsg === "") {
      return <></>;
    } else {
      return <div className="text-lg text-teal-800 font-medium">{errMsg}</div>;
    }
  }

  function SwitchRegisterBtn() {
    let forgetPwd = register ? "" : "忘记密码？";
    let switchRegisterBtn = register ? "已有账号？点击登录" : "点击注册新账号";
    let spanClassName = "font-bold text-teal-600 hover:text-teal-500";
    let divClassName = "text-sm cursor-pointer";
    let boxClassName = "flex items-center justify-between";
    return (
      <div className={boxClassName}>
        <div
          className={divClassName}
          onClick={() => {
            router.push("/forget").then();
          }}
        >
          <span className={spanClassName}>{forgetPwd}</span>
        </div>
        <div
          className={divClassName}
          onClick={() => {
            setErrMsg("");
            setRegister(!register);
          }}
        >
          <span className={spanClassName}>{switchRegisterBtn}</span>
        </div>
      </div>
    );
  }

  function SubmitBtn() {
    const word = register ? "注册" : "登录";
    async function submit() {
      if (register) {
        if (password !== repeatPassword) {
          setErrMsg("两次密码不一致");
          return;
        }
        axios
          .post(
            Constants.baseUrl + Constants.teacherRegisterUrl,
            {
              username,
              password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            setErrMsg("");
            setRegister(false);
          })
          .catch((err) => {
            console.log(err);
            setErrMsg(err.response.data.message);
          });
      } else {
        axios
          .post(
            Constants.baseUrl + Constants.teacherLoginUrl,
            {
              username,
              password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (res) => {
            setErrMsg("");
            localStorage.setItem("token", res.data.data.token);
            await router.push("/");
          })
          .catch((err) => {
            setErrMsg(err.response.data.message);
          });
      }
    }
    return (
      <div
        onClick={() => submit()}
        className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {word}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col">
            <Image src="/tennis.svg" width={150} height={150} alt="Tennis" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {register ? "注册教师账号" : "登录到教师账号"}
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <UsernameContext.Provider value={{ username, setUsername }}>
              <PasswordContext.Provider value={{ password, setPassword }}>
                <RepeatPasswordContext.Provider
                  value={{
                    repeatPassword,
                    setRepeatPassword,
                  }}
                >
                  <UsernameInput />
                  <PasswordInput />
                  {register ? <RepeatPasswordInput /> : <></>}
                  <ErrMsg />
                  <SwitchRegisterBtn />
                  <SubmitBtn />
                </RepeatPasswordContext.Provider>
              </PasswordContext.Provider>
            </UsernameContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
