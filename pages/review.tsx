import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";
import Student from "../components/Student";
import Constants, { btnClassName, inputClassName } from "../components/consts";
import { Listbox } from "@headlessui/react";
import axios from "axios";

function Review() {
  const router = useRouter();

  const [student, setStudent] = useState<any>({});
  const [score, setScore] = useState(-1);
  const [video, setVideo] = useState("");
  const [frames, setFrames] = useState<String[]>([]);
  const [count, setCount] = useState(-1);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setStudent(JSON.parse(localStorage.getItem("student") || "{}"));
    console.log("finish");
  }, []);

  useEffect(() => {
    if (!student.id) {
      return;
    }
    setScore(student.score);
    const url = `${Constants.baseUrl + Constants.videosUrl}/${student.id}`;
    axios
      .get(url)
      .then((res) => {
        let result = res.data.data.counts;
        setFrames(
          result.sort((x: string, y: string) => {
            const a = parseInt(x);
            const b = parseInt(y);
            return a - b;
          })
        );
        if (result.length > 0) {
          setCount(0);
        }
        setErrMsg("");
      })
      .catch((err) => {
        setErrMsg(err.message);
      });
  }, [student]);

  useEffect(() => {
    if (count === -1) {
      return;
    }
    console.log("set count to " + count);
    setVideo(
      Constants.baseUrl + `video/${student.id}/output-${frames[count]}.mp4`
    );
  }, [count, frames, student]);

  async function submit() {
    axios
      .post(
        Constants.baseUrl + Constants.submitUrl,
        {
          username: student.username,
          newScore: score,
        },
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
        setErrMsg(err.message);
      });
  }

  return (
    <>
      <Header isIndex={false} title="复核" />
      <Student username={student.username} />
      <div className="flex flex-col items-center mt-10">
        <div>
          <video
            className=""
            width={640}
            height={480}
            src={video}
            controls
          ></video>
        </div>
        <div className="my-5">
          <input
            type="number"
            value={score}
            className={inputClassName + " text-lg"}
            onChange={(e) => setScore(parseInt(e.target.value))}
          />{" "}
        </div>
        {errMsg !== "" ? (
          <div className="text-lg text-teal-800 font-bold mb-5">{errMsg}</div>
        ) : (
          <></>
        )}
        <div className={btnClassName} onClick={() => submit()}>
          确认修改成绩
        </div>

        {count !== -1 ? (
          <div className="mt-5">
            <Listbox value={count} onChange={setCount}>
              <Listbox.Button>
                <div className="rounded-md bg-teal-50 px-5 py-2 text-center font-bold text-teal-800 mb-3 w-28">
                  第 {count + 1} 球
                </div>
              </Listbox.Button>
              <Listbox.Options>
                {frames.map((_, index) =>
                  index !== count ? (
                    <Listbox.Option key={"show" + index} value={index}>
                      <div className="rounded-md hover:bg-teal-50 px-5 py-2 text-center font-bold text-teal-800 mb-3 cursor-pointer">
                        第 {index + 1} 球
                      </div>
                    </Listbox.Option>
                  ) : (
                    <div key={"hide" + index}></div>
                  )
                )}
              </Listbox.Options>
            </Listbox>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Review;
