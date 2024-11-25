import { observer } from "mobx-react-lite";
import "./chat.less";
import { Button, Input } from "antd";
import { meet } from "../../../core";
import { useState } from "react";
import { Tools } from "../../../core/tools";

const Message = observer(({ data }: { data: any }) => {
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 使用 12 小时制
    });
  }
  return (
    <div
      className={`chat-content-message-item chat-content-message-item-${data.user_id == Tools.UserID() ? "right" : "left"}`}
    >
      <img
        className="chat-content-message-item-img"
        src="data:image/jpeg;base64,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"
        alt="1"
      />
      <div className="chat-content-message-item-content">
        <div className="chat-content-message-item-time">
          <span className="chat-content-message-item-time-text">
            {formatTimestamp(data.time)}
          </span>
        </div>
        <div className="chat-content-message-item-context">
          <div className="chat-container-message-item-context-text">
            {data.data}
          </div>
        </div>
      </div>
    </div>
  );
});

const Chat = observer(() => {
  console.log(meet.activeChat);
  return (
    <div className="chat-container">
      <div className="chat-content-head">
        <span className="chat-content-head-text">
          Chats ({meet.activeChat?.MessageData.length})
        </span>
      </div>
      <div className="chat-content">
        {meet.activeChat?.MessageData.map((i) => {
          return <Message key={i.time} data={i} />;
        })}
      </div>
      <div className="chat-content-message-input">
        <InputMessage />
      </div>
    </div>
  );
});

export default Chat;

const InputMessage = observer(() => {
  const [content, setContent] = useState("");
  const send = () => {
    meet.activeChat.sendMessage(content);
  };
  return (
    <div className="chat-content-message-input-container">
      <Input.TextArea
        rows={4}
        value={content}
        onChange={(r) => {
          setContent(r.target.value);
        }}
        placeholder="Message to your friend..."
        className="chat-content-message-input-area"
      ></Input.TextArea>
      <Button className="chat-content-message-input-send" onClick={send}>
        发送
      </Button>
    </div>
  );
});
