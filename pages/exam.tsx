import Header from "../components/Header";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useRef, useState } from "react";

import Constants, { btnClassName } from "../components/consts";
import Student from "../components/Student";
import axios from "axios";

function Exam() {
  const [student, setStudent] = useState<any>({});
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [video, setVideo] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [newScore, setNewScore] = useState(-1);
  const [inTest, setInTest] = useState(false);
  const [locations, setLocations] = useState<
    {
      x: number;
      y: number;
    }[]
  >([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const router = useRouter();

  useEffect(() => {
    setStudent(JSON.parse(localStorage.getItem("student") || "{}"));
    setVideo(Constants.baseUrl + Constants.firstUrl);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, []);

  useEffect(() => {
    function returnFunc() {
      if (ws) {
        console.log("Close!");
        ws.close();
      }
    }
    if (ws === null) {
      setWs(new WebSocket("ws://localhost:4200"));
      return returnFunc;
    }
    ws.onmessage = (e) => {
      const data = e.data;
      if (data.length < 10) {
        setNewScore(parseInt(data));
      } else if (data.length > 100) {
        setVideo("data:image/jpeg;base64," + data);
      }
    };
    return returnFunc;
  }, [ws]);

  function newLocations() {
    setErrMsg("");
    alert("开始");
    if (canvasCtxRef.current && canvasRef.current) {
      canvasCtxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    setLocations([]);
  }

  function draw(e: MouseEvent<HTMLCanvasElement>) {
    if (canvasRef.current && locations.length < 6) {
      const xPage = e.pageX;
      const yPage = e.pageY;
      const xCanvas = canvasRef.current.offsetLeft;
      const yCanvas = canvasRef.current.offsetTop;
      const x = xPage - xCanvas;
      const y = yPage - yCanvas;
      if (canvasCtxRef.current) {
        canvasCtxRef.current.beginPath();
        canvasCtxRef.current.arc(x, y, 3, 0, Math.PI * 2);
        canvasCtxRef.current.fillStyle = "red";
        canvasCtxRef.current.fill();
        canvasCtxRef.current.closePath();
      }
      console.log({ x: x, y: y });
      setLocations([...locations, { x, y }]);
    }
  }

  function startExam() {
    setErrMsg("");
    if (locations.length !== 6) {
      setErrMsg("请标记所有点");
      return;
    } else if (inTest) {
      setErrMsg("已在考试中");
      return;
    }
    if (ws) {
      setInTest(true);
      ws.send(student.id);
    }
  }

  async function examEnd() {
    setErrMsg("");
    if (!inTest) {
      setErrMsg("未在考试中");
      return;
    }
    if (ws) {
      setInTest(false);
      ws.send("stop");
    }
    if (newScore !== -1) {
      axios
        .post(
          Constants.baseUrl + Constants.submitUrl,
          { newScore, username: student.username },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then(async (res) => {
          await router.push("/");
        })
        .catch((err) => {
          setErrMsg(err.response.data.message);
        });
    }
  }

  return (
    <>
      <Header title="考试" isIndex={false} />
      <Student username={student.username} />
      <div className="flex flex-col mt-5">
        <div className="flex flex-col mx-10">
          <div className="flex justify-between mx-20 mb-10">
            <div
              onClick={() => newLocations()}
              className={
                btnClassName +
                " mx-auto px-5 py-0 w-24 mt-5 text-center h-10 leading-10"
              }
            >
              定位
            </div>
            <div
              onClick={() => startExam()}
              className={
                btnClassName +
                " mx-auto px-5 py-0 w-24 mt-5 text-center h-10 leading-10"
              }
            >
              开始
            </div>
            <div
              onClick={() => examEnd()}
              className={
                btnClassName +
                " mx-auto px-5 py-0 w-24 mt-5 text-center h-10 leading-10"
              }
            >
              结束
            </div>
          </div>
          <div className="flex flex-col justify-between items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video} className="" alt="球场" width={640} height={480} />
            <canvas
              ref={canvasRef}
              onMouseUp={(e) => draw(e)}
              className="absolute"
              width={640}
              height={480}
            />
            {newScore !== -1 ? (
              <div className="text-teal-800 font-bold text-lg mt-5">
                当前得分: {newScore} 分
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {errMsg !== "" ? (
          <div className="m-auto text-teal-800 font-bold text-lg">{errMsg}</div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Exam;
