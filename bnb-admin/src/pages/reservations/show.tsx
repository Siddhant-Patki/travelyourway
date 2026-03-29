import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Tag, Descriptions } from "antd";

const { Title } = Typography;

const statusColors: Record<string, string> = {
  pending: "orange",
  confirmed: "blue",
  completed: "green",
  cancelled: "red",
};

export const ReservationShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const formatDate = (value: any) =>
    value?.toDate ? value.toDate().toLocaleDateString() : value ?? "—";

  return (
    <Show isLoading={isLoading}>
      <Title level={4}>Reservation Details</Title>
      <Descriptions bordered column={2} style={{ marginTop: 16 }}>
        <Descriptions.Item label="Listing ID">{record?.listingId}</Descriptions.Item>
        <Descriptions.Item label="Guest User ID">{record?.userId}</Descriptions.Item>
        <Descriptions.Item label="Check In">{formatDate(record?.checkIn)}</Descriptions.Item>
        <Descriptions.Item label="Check Out">{formatDate(record?.checkOut)}</Descriptions.Item>
        <Descriptions.Item label="Guest Count">{record?.guestCount}</Descriptions.Item>
        <Descriptions.Item label="Total Price">₹{record?.totalPrice}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColors[record?.status] ?? "default"}>
            {record?.status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Blockchain Tx Hash">
          {record?.txHash ? (
            <Typography.Text copyable>{record.txHash}</Typography.Text>
          ) : (
            <Typography.Text type="secondary">Not yet set</Typography.Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Created At" span={2}>
          {formatDate(record?.createdAt)}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
