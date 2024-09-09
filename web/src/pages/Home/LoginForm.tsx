import { Button, Checkbox, Divider, Form, FormProps, Input } from "antd";
import { observer } from "mobx-react-lite";
import "./form.less";
import { routers } from "../../config/routers";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  meetingID?: string;
};

export const LoginForm = observer(() => {
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  const onMeetFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    navigate("/meeting");
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <Form
        name="basic"
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Email" className="input" />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" placeholder="Password" className="input" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="button">
            <span className="button-text">Sign in</span>
          </Button>
        </Form.Item>
        <div></div>
        <Divider className="divider">
          <div className="divider-content">OR</div>
        </Divider>
      </Form>
      <Form
        name="meeting"
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onMeetFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          name="meetingID"
          rules={[{ required: true, message: "Please input your Meeting ID!" }]}
        >
          <Input value={123} placeholder="Meeting ID" className="input" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="button">
            <span className="button-text">Join Meeting</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
