import { observer } from "mobx-react-lite";
import "./Controller.less";
import { Slider } from "antd";
import { meet } from "../../../core";
export default observer(() => {
  return (
    <div className="controller-container">
      <div className="controller-item controller-voice">
        <Slider
          onChange={(i) => {
            console.log(i);
            meet.activeChat.silence();
          }}
        ></Slider>
      </div>
      <div className="controller-item"></div>
      <div className="controller-item"></div>
      <div className="controller-item"></div>
      <div className="controller-item"></div>
      <div className="controller-item controller-leave">
        <span
          className="controller-leave-text"
          onClick={() => {
            meet.leaveMeeting();
          }}
        >
          Leave Meeting
        </span>
      </div>
    </div>
  );
});
