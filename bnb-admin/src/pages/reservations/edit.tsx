import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { useInvalidate } from "@refinedev/core";

export const ReservationEdit = () => {
  const invalidate = useInvalidate();
  const { formProps, saveButtonProps } = useForm({
    onMutationSuccess: () => {
      invalidate({ resource: "reservations", invalidates: ["list", "detail"] });
    },
  });

  // Convert Firestore Timestamps to dayjs before the form renders
  const initialValues = {
    ...formProps.initialValues,
    checkIn: formProps.initialValues?.checkIn?.toDate
      ? dayjs(formProps.initialValues.checkIn.toDate())
      : formProps.initialValues?.checkIn
      ? dayjs(formProps.initialValues.checkIn)
      : undefined,
    checkOut: formProps.initialValues?.checkOut?.toDate
      ? dayjs(formProps.initialValues.checkOut.toDate())
      : formProps.initialValues?.checkOut
      ? dayjs(formProps.initialValues.checkOut)
      : undefined,
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} initialValues={initialValues} layout="vertical">
        <Form.Item label="Listing ID" name="listingId" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Guest User ID" name="userId" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Check In" name="checkIn" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Check Out" name="checkOut" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Guest Count" name="guestCount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Total Price (₹)" name="totalPrice" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
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
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};