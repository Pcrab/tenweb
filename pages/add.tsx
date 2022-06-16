import Header from "../components/Header";
import React, { useState } from "react";

import Constants, { btnClassName, inputClassName } from "../components/consts";
import { useRouter } from "next/router";
import axios from "axios";

function Add() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const router = useRouter();

  function add() {
    if (username === "") {
      setErrMsg("请输入姓名");
      return;
    }
    if (password === "") {
      setErrMsg("请输入密码");
      return;
    }
    if (password !== repeatPassword) {
      setErrMsg("两次输入的密码不一致");
      return;
    }

    axios
      .post(
        Constants.baseUrl + Constants.studentRegisterUrl,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        router.push("/").then();
      })
      .catch((err) => {
        setErrMsg(err.response.data.message);
      });
  }

  return (
    <>
      <Header isIndex={false} title="添加学生"></Header>
      <div className="flex flex-col max-w-md m-auto mt-24">
        <input
          type="text"
          className={inputClassName + " mb-6"}
          placeholder="姓名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className={inputClassName + " mb-6"}
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className={inputClassName + " mb-6"}
          placeholder="重复密码"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        {errMsg === "" ? (
          <></>
        ) : (
          <div className="text-teal-800 text-md mb-5 font-bold">{errMsg}</div>
        )}
        <div className={btnClassName} onClick={() => add()}>
          添加
        </div>
      </div>
    </>
  );
}

export default Add;
