import { List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image, Tag, Typography } from "antd";
import type { BaseRecord } from "@refinedev/core";

const { Text } = Typography;

export const ListingList = () => {
  const { tableProps } = useTable({ syncWithLocation: true });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="imgSrc"
          title="Image"
          render={(value) =>
            value ? (
              <Image src={value} width={80} height={60} style={{ objectFit: "cover", borderRadius: 6 }} />
            ) : (
              <Text type="secondary">No image</Text>
            )
          }
        />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="location" title="Location" />
        <Table.Column
          dataIndex="price"
          title="Price / Night"
          render={(value) => `₹${value}`}
        />
        <Table.Column dataIndex="category" title="Category" render={(value) => <Tag>{value}</Tag>} />
        <Table.Column dataIndex="roomCount" title="Rooms" />
        <Table.Column dataIndex="guestCount" title="Max Guests" />
        <Table.Column
          dataIndex="isAvailable"
          title="Available"
          render={(value) =>
            value ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>
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
