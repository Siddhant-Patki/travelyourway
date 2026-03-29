import { List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Tag, Typography } from "antd";
import type { BaseRecord } from "@refinedev/core";

const { Text } = Typography;

const statusColors: Record<string, string> = {
  pending: "orange",
  confirmed: "blue",
  completed: "green",
  cancelled: "red",
};

export const ReservationList = () => {
  const { tableProps } = useTable({ syncWithLocation: true });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="listingId" title="Listing ID" />
        <Table.Column dataIndex="userId" title="Guest ID" />
        {/* <Table.Column
          dataIndex="checkIn"
          title="Check In"
          render={(value) => value?.toDate ? value.toDate().toLocaleDateString() : value}
        />
        <Table.Column
          dataIndex="checkOut"
          title="Check Out"
          render={(value) => value?.toDate ? value.toDate().toLocaleDateString() : value}
        /> */}
        <Table.Column dataIndex="guestCount" title="Guests" />
        <Table.Column
          dataIndex="totalPrice"
          title="Total Price"
          render={(value) => `₹${value}`}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => (
            <Tag color={statusColors[value] ?? "default"}>{value?.toUpperCase()}</Tag>
          )}
        />
        <Table.Column
          dataIndex="txHash"
          title="Tx Hash"
          render={(value) =>
            value ? (
              <Text copyable ellipsis style={{ maxWidth: 120 }}>
                {value}
              </Text>
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
