import { observer } from "mobx-react-lite";
import "./Controller.less";
import { Slider } from "antd";
export default observer(() => {
  return (
    <div className="controller-container">
      <div className="controller-item controller-voice">
        <Slider></Slider>
      </div>
      <div className="controller-item"></div>
      <div className="controller-item"></div>
      <div className="controller-item"></div>
      <div className="controller-item"></div>
      <div className="controller-item controller-leave">
        <span className="controller-leave-text">Leave Meeting</span>
      </div>
    </div>
  );
});
