import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Switch } from "antd";
import { useInvalidate } from "@refinedev/core";

export const DiningEdit = () => {
  const invalidate = useInvalidate();
  const { formProps, saveButtonProps } = useForm({
    onMutationSuccess: () => {
      invalidate({ resource: "dining", invalidates: ["list", "detail"] });
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Restaurant Name" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Cuisine" name="cuisine" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Indian", value: "Indian" },
              { label: "Italian", value: "Italian" },
              { label: "Chinese", value: "Chinese" },
              { label: "Continental", value: "Continental" },
              { label: "Japanese", value: "Japanese" },
              { label: "Mexican", value: "Mexican" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Price per Person (₹)" name="pricePerPerson" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Max Guests" name="maxGuests" rules={[{ required: true }]}>
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
      </Form>
    </Edit>
  );
};
