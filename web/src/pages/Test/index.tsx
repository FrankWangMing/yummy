import { useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";
import { MeetController } from "../../core/meet.ts";
import { meet } from "../../core";
import { Tools } from "../../core/tools.ts";
const Test = () => {
  const { current } = useRef<MeetController>(meet);
  console.log(current);
  const video = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (video.current) {
      (async () => {
        video.current.srcObject = await meet.mediaController.getUserMedia();
        // remoteVideo.current.srcObject = await meet.mediaController.getUserMedia();
      })();
    }
  }, []);

  const [meet_id, setMeetId] = useState("");
  const createMeeting = async () => {
    current.createMeeting();
  };

  const joinMeeting = () => {
    current.joinMeeting(meet_id);
  };

  const reconnectMeeting = () => {
    current.reconnectMeeting();
  };

  const leaveMeeting = () => {
    current.leaveMeeting();
  };

  return (
    <>
      <video
        ref={video}
        autoPlay
        height={100}
        width={100}
        style={{ background: "blue" }}
      ></video>
      <video
       id="remoteVideo"
        ref={remoteVideo}
        autoPlay
        height={100}
        width={100}
        style={{ background: "blue" }}
      ></video>
      <Button onClick={createMeeting}>create Meeting</Button>
      <Input
        placeholder="Enter Meeting Id"
        value={meet_id}
        onChange={(e) => setMeetId(e.target.value)}
      ></Input>
      <div>{Tools.UserID()}</div>
      <Button onClick={joinMeeting}>join Meeting</Button>
      <Button onClick={reconnectMeeting}>reconnect Meeting</Button>
      <Button onClick={leaveMeeting}>leave Meeting</Button>
    </>
  );
};

export default Test;
