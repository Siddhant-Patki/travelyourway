import { List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image, Tag, Typography } from "antd";
import type { BaseRecord } from "@refinedev/core";

const { Text } = Typography;

export const DiningList = () => {
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
        <Table.Column dataIndex="title" title="Restaurant" />
        <Table.Column dataIndex="location" title="Location" />
        <Table.Column dataIndex="cuisine" title="Cuisine" render={(value) => <Tag color="blue">{value}</Tag>} />
        <Table.Column
          dataIndex="pricePerPerson"
          title="Price / Person"
          render={(value) => `₹${value}`}
        />
        <Table.Column dataIndex="maxGuests" title="Max Guests" />
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
