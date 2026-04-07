import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Switch } from "antd";

export const DiningCreate = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();

  const handleFinish = (values: any) => {
    return onFinish({
      ...values,
      createdAt: new Date(),
      isAvailable: values.isAvailable ?? true,
    });
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        <Form.Item label="Restaurant Name" name="title" rules={[{ required: true }]}>
          <Input placeholder="e.g. Bukhara" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Describe the restaurant..." />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
          <Input placeholder="e.g. New Delhi, India" />
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
            placeholder="Select cuisine"
          />
        </Form.Item>

        <Form.Item label="Price per Person (₹)" name="pricePerPerson" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 2500" />
        </Form.Item>

        <Form.Item label="Max Guests" name="maxGuests" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Image URL" name="imgSrc">
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item label="User ID (Owner)" name="userId" rules={[{ required: true }]}>
          <Input placeholder="e.g. admin" />
        </Form.Item>

        <Form.Item label="Available" name="isAvailable" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
};
