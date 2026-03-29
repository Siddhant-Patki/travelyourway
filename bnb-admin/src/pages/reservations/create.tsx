import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import dayjs from "dayjs";

export const ReservationCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Listing ID" name="listingId" rules={[{ required: true }]}>
          <Input placeholder="e.g. 90QuAuN4PZqpHy7FSRNH" />
        </Form.Item>

        <Form.Item label="Guest User ID" name="userId" rules={[{ required: true }]}>
          <Input placeholder="e.g. 1" />
        </Form.Item>

        <Form.Item
          label="Check In"
          name="checkIn"
          rules={[{ required: true }]}
          getValueProps={(v) => ({ value: v ? dayjs(v) : undefined })}
          getValueFromEvent={(d: dayjs.Dayjs) => d ? d.format("YYYY-MM-DD") : null}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Check Out"
          name="checkOut"
          rules={[{ required: true }]}
          getValueProps={(v) => ({ value: v ? dayjs(v) : undefined })}
          getValueFromEvent={(d: dayjs.Dayjs) => d ? d.format("YYYY-MM-DD") : null}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Guest Count" name="guestCount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Total Price (₹)" name="totalPrice" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Status" name="status" initialValue="pending" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Blockchain Tx Hash" name="txHash">
          <Input placeholder="0x... (filled after blockchain payment)" />
        </Form.Item>
      </Form>
    </Create>
  );
};
