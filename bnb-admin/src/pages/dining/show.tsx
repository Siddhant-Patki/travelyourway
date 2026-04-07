import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image, Tag, Descriptions } from "antd";

const { Title } = Typography;

export const DiningShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      {record?.imgSrc && (
        <Image
          src={record.imgSrc}
          width="100%"
          style={{ maxHeight: 300, objectFit: "cover", borderRadius: 8, marginBottom: 24 }}
        />
      )}
      <Title level={3}>{record?.title}</Title>
      <Descriptions bordered column={2} style={{ marginTop: 16 }}>
        <Descriptions.Item label="Location">{record?.location}</Descriptions.Item>
        <Descriptions.Item label="Cuisine">
          <Tag color="blue">{record?.cuisine}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Price / Person">₹{record?.pricePerPerson}</Descriptions.Item>
        <Descriptions.Item label="Max Guests">{record?.maxGuests}</Descriptions.Item>
        <Descriptions.Item label="Available">
          {record?.isAvailable ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Owner (User ID)">{record?.userId}</Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {record?.description}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
