import { Button, Form, FormProps } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { meet } from "../../core";
import { MeetController } from "../../core/meet";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  meetingID?: string;
};
export default function CreateMeeting() {
  const navigate = useNavigate();
  const { current } = useRef<MeetController>(meet);
  const onMeetFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    current.createMeeting().then((meet_id) => {
      console.log("create meeting success", meet_id);
      if (!meet_id) {
        alert("create meeting failed");
        return;
      }
      const queryParams = new URLSearchParams({
        meet_id,
      }).toString();
      navigate("/meeting?" + queryParams);
    });
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
        {/* <Form.Item<FieldType>
          name="meetingID"
          rules={[{ required: true, message: "Please input your Meeting ID!" }]}
        >
          <Input value={123} placeholder="Meeting ID" className="input" />
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="button">
            <span className="button-text">Create Meeting</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
