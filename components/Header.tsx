import Image from "next/image";
import React from "react";
import Constants, { btnClassName } from "./consts";
import { useRouter } from "next/router";

interface HeaderProps {
  title: string;
  isIndex: boolean;
  isTeacher?: boolean;
  children?: React.ReactNode;
}

function Header(props: HeaderProps) {
  const router = useRouter();
  function logout() {
    localStorage.removeItem("token");
    router.push("/login").then();
  }

  function backToIndex() {
    router.push("/").then();
  }

  return (
    <>
      <div className="min-h-full bg-gray-800">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="h-10 w-10">
                <Image
                  src="/tennis.png"
                  width={100}
                  height={100}
                  alt="Tennis"
                />
              </div>
              {props.title ? (
                <div className="text-gray-300 ml-5 text-xl font-bold">
                  {props.title}
                </div>
              ) : (
                <></>
              )}
            </div>
            {props.isTeacher === false ? (
              <></>
            ) : (
              <div className="flex">
                <div
                  className="rounded-md text-gray-200 bg-gray-600 hover:bg-gray-500 px-3 py-2 font-medium text-lg cursor-pointer"
                  onClick={() => logout()}
                >
                  登出
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <header className="bg-white shadow flex items-center justify-between">
        <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{props.title}</h1>
        </div>
        {props.isIndex ? (
          props.children
        ) : (
          <div className={btnClassName + " mr-5"} onClick={() => backToIndex()}>
            返回主页
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
