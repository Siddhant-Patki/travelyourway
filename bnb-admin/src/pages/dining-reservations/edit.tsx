import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { useInvalidate } from "@refinedev/core";
import dayjs from "dayjs";

export const DiningReservationEdit = () => {
  const invalidate = useInvalidate();
  const { formProps, saveButtonProps } = useForm({
    onMutationSuccess: () => {
      invalidate({ resource: "dining_reservations", invalidates: ["list", "detail"] });
    },
  });

  const initialValues = {
    ...formProps.initialValues,
    date: formProps.initialValues?.date?.toDate
      ? dayjs(formProps.initialValues.date.toDate())
      : formProps.initialValues?.date
      ? dayjs(formProps.initialValues.date)
      : undefined,
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} initialValues={initialValues} layout="vertical">
        <Form.Item label="Restaurant ID" name="diningId" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Guest User ID" name="userId" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Guest Count" name="guestCount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Total Price (₹)" name="totalPrice" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Payment Method" name="paymentMethod">
          <Select
            options={[
              { label: "Card", value: "card" },
              { label: "Tokens", value: "tokens" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Booking Code" name="bookingCode">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
