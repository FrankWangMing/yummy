import { useEffect, useRef, useState } from "react";
import { Core, core } from "../../core";
import { Button, Input } from "antd";
const Test = () => {
  const {current} = useRef<Core>(core);
  console.log(current);
  const video = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if(video.current){
      (async ()=>{
        video.current.srcObject = await core.mediaController.getUserMedia()
      })()
    }
  },[])

  setTimeout(()=>{
    if(remoteVideo.current!=null){
      console.log("remoteVideo")
      console.log(core.peerController.host);

      core.peerController.host.addEventListener("track",event=>{
        console.log("track")
        const [remoteStream] = event.streams;
        remoteVideo.current!.srcObject = remoteStream;
      })
    }
  },2000)
  const [meet_id,setMeetId]=useState("");
  const createMeeting = async () => {
    current.createMeeting();
  }

  const joinMeeting = () => {
    current.joinMeeting(meet_id);
  }

  // console.log(video);
  // useEffect(() => {
  //   if (video.current == null) return;
  //   // Put variables in global scope to make them available to the browser console.
  //   const constraints = {
  //     audio: false,
  //     video: true,
  //   };

  //   navigator.mediaDevices
  //     .getUserMedia(constraints)
  //     .then((stream) => {
  //       const videoTracks = stream.getVideoTracks();
  //       console.log("Got stream with constraints:", constraints);
  //       console.log(`Using video device: ${videoTracks[0].label}`);
  //       stream.onremovetrack = () => {
  //         console.log("Stream ended");
  //       };
  //       console.log(video.current?.srcObject);
  //       console.log(stream);
  //       video.current!.srcObject = stream;
  //     })
  //     .catch((error) => {
  //       if (error.name === "OverconstrainedError") {
  //         console.error(
  //           `The resolution ${constraints.video.width.exact}x${constraints.video.height.exact} px is not supported by your device.`,
  //         );
  //       } else if (error.name === "NotAllowedError") {
  //         console.error(
  //           "You need to grant this page permission to access your camera and microphone.",
  //         );
  //       } else {
  //         console.error(`getUserMedia error: ${error.name}`, error);
  //       }
  //     });
  // }, [video]);

  // useEffect(() => {
  //   const p = new RTCPeer();
  //   console.log(p);
  //   p.aa().then((r) => {
  //     console.log(r);
  //   });
  //   // const processVideo = new VideoFrame({

  //   // })
  //   // new VideoDecoder({
  //   //     output:processVideo,
  //   //     error:onEncoderError
  //   // })
  // }, []);

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
      <Button onClick={joinMeeting}>join Meeting</Button>
    </>
  );
};

export default Test;
