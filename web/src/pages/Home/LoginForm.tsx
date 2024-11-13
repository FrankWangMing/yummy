import { Button, Divider, Form, FormProps, Input } from "antd";
import { observer } from "mobx-react-lite";
import "./form.less";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  meetingID?: string;
};

export const LoginForm = observer(() => {
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
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
      </Form>
    </div>
  );
});
