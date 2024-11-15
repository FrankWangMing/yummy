import "./meet.less";
import { observer } from "mobx-react-lite";
import NavBar from "./components/NavBar";
import { Col, Row } from "antd";
import LiveContent from "./components/LiveContent";
import Controller from "./components/Controller";
import UserList from "./UserList";
import Chat from "./Chat";
import { meet, videoController } from "../../core";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Tools } from "../../core/tools";
const Meet = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);  // 解析查询参数
  const meetId = params.get('meet_id');  // 获取 meet_id 参数
  console.log(meetId);

  useEffect(()=>{
    meet.loadMeeting(meetId).then(()=>{
      console.log("load meeting success")
    })

  },[])
  return (
    <div className="meet-background">
      <div className="meet-container">
        <div className="meet-content">
          <div className="meet-content-navbar">
            <NavBar />
          </div>
          <div className="meet-content-live">
            <Row gutter={[12, 12]} justify="center">
              {videoController.data.map((item) => {
                console.log(item)
                return (
                  <Col span={8} key={item.key} className="meet-content-live-item">
                    <LiveContent  ref={(value)=>{
                      item.ref = value
                    }} />
                  </Col>
                );
              })}
            </Row>
          </div>
          <Controller />
        </div>
        <div className="meet-user-list">
          <UserList />
          <Chat></Chat>
        </div>
      </div>
    </div>
  );
});

export default Meet;
