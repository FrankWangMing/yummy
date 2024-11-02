import "./meet.less";
import { observer } from "mobx-react-lite";
import NavBar from "./components/NavBar";
import { Col, Row } from "antd";
import LiveContent from "./components/LiveContent";
import Controller from "./components/Controller";
import UserList from "./UserList";
import Chat from "./Chat";
const Meet = observer(() => {
  return (
    <div className="meet-background">
      <div className="meet-container">
        <div className="meet-content">
          <div className="meet-content-navbar">
            <NavBar />
          </div>

          <div className="meet-content-live">
            <Row gutter={[12, 12]} justify="center">
              {[1, 23, 4, 5, 6, 6].map((item) => {
                return (
                  <Col span={8} className="meet-content-live-item">
                    <LiveContent />
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
