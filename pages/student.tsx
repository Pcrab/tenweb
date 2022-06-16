import Header from "../components/Header";
import Constants, { btnClassName, inputClassName } from "../components/consts";
import { useState } from "react";
import axios from "axios";

function Student() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [score, setScore] = useState("");
  const [errMsg, setErrMsg] = useState("");

  async function check() {
    setErrMsg("");
    setUsername("");
    setScore("");
    if (username === "" || password === "") {
      setErrMsg("用户名 或 密码 不得为空");
      return;
    }
    const res = axios
      .post(
        Constants.baseUrl + Constants.studentLoginUrl,
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
        setUsername(res.data.data.username);
        setScore(res.data.data.score);
      })
      .catch((err) => {
        setErrMsg(err.response.data.message);
      });
  }

  return (
    <>
      <Header isIndex={true} isTeacher={false} title="学生查分系统"></Header>
      <div className="flex flex-col items-center mt-20">
        <div className="font-bold text-4xl mb-10">登陆并查询分数</div>
        <div>
          <input
            type="text"
            className={inputClassName + " mb-5"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ID"
          />
        </div>
        <div>
          <input
            type="password"
            className={inputClassName + " mb-5"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
          />
        </div>
        {errMsg === "" ? (
          <></>
        ) : (
          <div className="font-bold text-lg text-center text-teal-800">
            {errMsg}
          </div>
        )}
        <div className={btnClassName + " w-36 mb-5"} onClick={() => check()}>
          查询
        </div>
        <div className="font-bold text-teal-800">
          {score === ""
            ? ""
            : score === "null"
            ? `${username} 同学，您还未参加考试，无法查询分数。`
            : `${username} 同学，您的分数为：${score} 分`}
        </div>
      </div>
    </>
  );
}

export default Student;
