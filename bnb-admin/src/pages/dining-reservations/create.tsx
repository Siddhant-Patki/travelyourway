import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import dayjs from "dayjs";

export const DiningReservationCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Restaurant ID" name="diningId" rules={[{ required: true }]}>
          <Input placeholder="e.g. abc123" />
        </Form.Item>

        <Form.Item label="Guest User ID" name="userId" rules={[{ required: true }]}>
          <Input placeholder="e.g. user123" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true }]}
          getValueProps={(v) => ({ value: v ? dayjs(v) : undefined })}
          getValueFromEvent={(d: dayjs.Dayjs) => d ? d.toDate() : null}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Guest Count" name="guestCount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Total Price (₹)" name="totalPrice" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Payment Method" name="paymentMethod" initialValue="card">
          <Select
            options={[
              { label: "Card", value: "card" },
              { label: "Tokens", value: "tokens" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Booking Code" name="bookingCode">
          <Input placeholder="Auto-generated on booking" />
        </Form.Item>
      </Form>
    </Create>
  );
};
