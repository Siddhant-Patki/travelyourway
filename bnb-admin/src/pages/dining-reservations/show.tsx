import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Tag, Descriptions } from "antd";

const { Title } = Typography;

export const DiningReservationShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const formatDate = (value: any) =>
    value?.toDate ? value.toDate().toLocaleDateString() : value ?? "—";

  return (
    <Show isLoading={isLoading}>
      <Title level={4}>Dining Reservation Details</Title>
      <Descriptions bordered column={2} style={{ marginTop: 16 }}>
        <Descriptions.Item label="Restaurant ID">{record?.diningId}</Descriptions.Item>
        <Descriptions.Item label="Guest User ID">{record?.userId}</Descriptions.Item>
        <Descriptions.Item label="Date">{formatDate(record?.date)}</Descriptions.Item>
        <Descriptions.Item label="Guest Count">{record?.guestCount}</Descriptions.Item>
        <Descriptions.Item label="Total Price">₹{record?.totalPrice}</Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          <Tag>{record?.paymentMethod ?? "card"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Booking Code">
          {record?.bookingCode ? (
            <Typography.Text code copyable>{record.bookingCode}</Typography.Text>
          ) : (
            <Typography.Text type="secondary">—</Typography.Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Reserved At">
          {formatDate(record?.reservedAt)}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
