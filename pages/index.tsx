import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";

import Constants, { btnClassName } from "../components/consts";
import Header from "../components/Header";
import axios from "axios";

export interface Student {
  id: string;
  username: string;
  score: string;
}
const pageName = "总览";
function Home() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);

  const testLogin = useCallback(async () => {
    if (localStorage.getItem("token") === null) {
      await router.push("/login");
      return;
    }
    axios
      .get(Constants.baseUrl + Constants.getAllUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setStudents(res.data.data);
        }
      })
      .catch(async (err) => {
        console.log(err);
        await router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    testLogin().then();
  }, [testLogin]);

  function addStudent() {
    router.push("/add").then();
  }

  function review(student: Student) {
    localStorage.setItem("student", JSON.stringify(student));
    router.push("/review").then();
  }

  function startExam(student: Student) {
    localStorage.setItem("student", JSON.stringify(student));
    router.push("/exam").then();
  }

  function modifyStudent(student: Student) {
    localStorage.setItem("student", JSON.stringify(student));
    router.push("/modify").then();
  }

  return (
    <>
      <Header title={pageName} isIndex={true}>
        <div className={btnClassName + " mr-5"} onClick={() => addStudent()}>
          添加学生
        </div>
      </Header>
      <div className="flex flex-col mt-10 border-4 border-teal-800">
        {students.map((student) => (
          <div
            key={student.username}
            className="relative cursor-pointer flex focus:outline-none hover:bg-teal-50 px-6 h-16 border-b-2 border-teal-800 last:border-b-0"
          >
            <div className="flex h-auto w-full items-center justify-between font-medium text-lg">
              <div className="flex h-full items-center">
                <div className="border-teal-700 w-20 ml-6">
                  {student.username}
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  {student.score !== undefined ? (
                    <div className="flex items-center">
                      <div className="mr-2">{student.score} 分</div>
                      <div
                        className={btnClassName}
                        onClick={() => review(student)}
                      >
                        复核
                      </div>
                    </div>
                  ) : (
                    <div
                      className={btnClassName}
                      onClick={() => startExam(student)}
                    >
                      开始考试
                    </div>
                  )}
                </div>
                <div
                  className={btnClassName}
                  onClick={() => modifyStudent(student)}
                >
                  修改信息
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
