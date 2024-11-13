import { Input, Button, Form, FormProps } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  meetingID?: string;
};
export default function Join() {
  const navigate = useNavigate();
  const onMeetFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    navigate("/meeting");
  };

  return (
    <div>
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
}
