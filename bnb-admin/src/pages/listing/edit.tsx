import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Switch, DatePicker } from "antd";
import { useInvalidate } from "@refinedev/core";
import dayjs from "dayjs";

export const ListingEdit = () => {
  const invalidate = useInvalidate();
  const { formProps, saveButtonProps } = useForm({
    onMutationSuccess: () => {
      invalidate({ resource: "listing", invalidates: ["list", "detail"] });
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Hotel", value: "hotel" },
              { label: "Villa", value: "villa" },
              { label: "Apartment", value: "apartment" },
              { label: "Resort", value: "resort" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Price per Night (₹)" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Room Count" name="roomCount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Bathroom Count" name="bathroomCount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Max Guest Count" name="guestCount" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Total Available Rooms" name="totalAvailableRooms" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Image URL" name="imgSrc">
          <Input />
        </Form.Item>

        <Form.Item label="User ID (Owner)" name="userId" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Available" name="isAvailable" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label="Available From"
          name="availableFrom"
          rules={[{ required: true }]}
          getValueProps={(v) => ({ value: v ? dayjs(v) : undefined })}
          getValueFromEvent={(d: dayjs.Dayjs) => d ? d.format("YYYY-MM-DD") : null}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(d) => d && d < dayjs().startOf("day")}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          label="Available To"
          name="availableTo"
          rules={[{ required: true }]}
          getValueProps={(v) => ({ value: v ? dayjs(v) : undefined })}
          getValueFromEvent={(d: dayjs.Dayjs) => d ? d.format("YYYY-MM-DD") : null}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(d) => d && d < dayjs().startOf("day")}
            format="YYYY-MM-DD"
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};