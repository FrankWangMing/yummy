import { observer } from "mobx-react-lite";
import "./LiveContent.less";
import { useImperativeHandle } from "react";
import { useRef } from "react";
import { forwardRef } from "react";
export default  forwardRef((props, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useImperativeHandle(ref, () => ({
      play: async () => {
          await videoRef.current?.play();
      },
      setVideo: (video) => {
          videoRef.current.srcObject = video;
      }
  }));
  return (
    <div className="content" >
      <video ref={videoRef} className="content-video" autoPlay >
      </video>
    </div>
  );
});
