import { Alert, Button, message } from "antd";
import { observer } from "mobx-react-lite";
import "./navbar.less";
export default observer(() => {
  const [messageApi, contextHolder] = message.useMessage();

  const copyURL = async () => {
    const textToCopy = window.location.href;
    try {
      await navigator.clipboard.writeText(textToCopy);
      messageApi.success("复制成功");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="navbar">
      {contextHolder}
      <Button onClick={copyURL} ghost>
        分享会议
      </Button>
    </div>
  );
});
