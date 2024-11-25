import { observer } from "mobx-react-lite";
import "./LiveContent.less";
import { useEffect, useImperativeHandle, useState } from "react";
import { useRef } from "react";
import { forwardRef } from "react";
import { Spin } from "antd";
export default forwardRef((props, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(true);
  useImperativeHandle(ref, () => ({
    play: async () => {
      await videoRef.current?.play();
    },
    setVideo: (video) => {
      videoRef.current.srcObject = video;
      setLoading(true);
    },
  }));

  return (
    <div className="live-content">
      <video
        ref={videoRef}
        className="live-content-video"
        autoPlay
        controls={false}
      />
    </div>
  );
});
