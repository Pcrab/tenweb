import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import Student from "../components/Student";
import Constants, { btnClassName, inputClassName } from "../components/consts";
import axios from "axios";

function Modify() {
  const router = useRouter();

  const [student, setStudent] = useState<any>({});
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setStudent(JSON.parse(localStorage.getItem("student") || "{}"));
  }, []);

  useEffect(() => {
    setNewUsername(newUsername);
  }, [newUsername]);

  function confirm() {
    let newStudent: any = {
      username: student.username,
    };
    if (newUsername !== "") {
      newStudent.newUsername = newUsername;
    }
    if (newPassword !== "") {
      newStudent.newPassword = newPassword;
    }
    axios
      .post(Constants.baseUrl + Constants.modifyUrl, newStudent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(async (res) => {
        await router.push("/");
      })
      .catch((err) => {
        setErrMsg(err.response.data.message);
      });
  }

  return (
    <>
      <Header isIndex={false} title="修改学生信息"></Header>
      <Student username={student.username} />
      <div className="flex flex-col max-w-md m-auto mt-24">
        <input
          type="text"
          className={inputClassName + " mb-6"}
          placeholder="姓名"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          type="password"
          className={inputClassName + " mb-6"}
          placeholder="密码"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {errMsg === "" ? (
          <></>
        ) : (
          <div className="text-teal-800 text-md mb-5 font-bold">{errMsg}</div>
        )}
        <div className={btnClassName} onClick={() => confirm()}>
          确认修改
        </div>
      </div>
    </>
  );
}

export default Modify;
