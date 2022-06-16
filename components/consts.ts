import crypto from "crypto";

const localDomain = "http://localhost:8080/";

const Constants = {
  baseUrl: localDomain,
  teacherRegisterUrl: "teachers/register",
  teacherLoginUrl: "teachers/login",
  teacherLogoutUrl: "logout/teacher",
  studentRegisterUrl: "teachers/createStudent",
  studentLoginUrl: "students/login",
  studentCheckUrl: "check",
  modifyUrl: "teachers/updateStudent",
  getAllUrl: "teachers/getStudents",
  submitUrl: "teachers/updateStudent",

  firstUrl: "first",
  videosUrl: "videos",
  videoUrl: "video",
  defaultRegister: false,
  defaultErrMsg: "",
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const btnClassName =
  "rounded-md bg-teal-300 hover:bg-teal-500 py-2 px-2 cursor-pointer text-lg text-center";
export const inputClassName =
  "appearance-none rounded relative block w-full px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 text-lg";

export default Constants;
