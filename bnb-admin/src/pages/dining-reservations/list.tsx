import { List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Tag, Typography } from "antd";
import type { BaseRecord } from "@refinedev/core";

const { Text } = Typography;

export const DiningReservationList = () => {
  const { tableProps } = useTable({ syncWithLocation: true });

  const formatDate = (value: any) =>
    value?.toDate ? value.toDate().toLocaleDateString() : value ?? "—";

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="diningId" title="Restaurant ID" />
        <Table.Column dataIndex="userId" title="Guest ID" />
        <Table.Column
          dataIndex="date"
          title="Date"
          render={(value) => formatDate(value)}
        />
        <Table.Column dataIndex="guestCount" title="Guests" />
        <Table.Column
          dataIndex="totalPrice"
          title="Total Price"
          render={(value) => `₹${value}`}
        />
        <Table.Column
          dataIndex="paymentMethod"
          title="Payment"
          render={(value) => <Tag>{value ?? "card"}</Tag>}
        />
        <Table.Column
          dataIndex="bookingCode"
          title="Booking Code"
          render={(value) =>
            value ? (
              <Text code copyable>{value}</Text>
            ) : (
              <Text type="secondary">—</Text>
            )
          }
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
