import CreateMeeting from "./CreateMeeting";
import Join from "./Join";
import "./home.less";
import "./form.less";
import { Divider } from "antd";
export default function Example() {
  return (
    <div className="home-container ">
      <div className="inner-container">
        <div className="text-container">
          <div className="text">
            Just wanted to say thank you. Helped me get my focus and my
            confidence back.
          </div>
          <div className="circle">
            <div className="circle-text">Z</div>
          </div>
        </div>
        <div className="sign-in-box">
          {/* <div className="sign-in-text">
            <div>Sign-in</div>
          </div> */}
          <CreateMeeting />
          {/* <Divider className="divider">
            <div className="divider-content">OR</div>
          </Divider>
          <Join /> */}
        </div>
      </div>
    </div>
  );
}
