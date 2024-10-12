import Link from 'next/link';
import { Checkbox, Title, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table'; // Adjust this import based on your project structure
import PencilIcon from '@components/icons/pencil'; // Adjust this import based on your icon setup
import DeletePopover from '@/app/shared/delete-popover'; // Adjust this import based on your delete functionality

interface SalesItem {
  id: string;
  X: string;
  Y: string;
  expiration: string;
  product: { id: string; name: string }[]; // Adjust based on the structure of the product data
}

type Columns = {
  sortConfig?: any;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};

export const getSalesColumns = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  onChecked,
}: Columns) => [
  {
    title: <></>,
    dataIndex: 'checked',
    key: 'checked',
    width: 30,
    render: (_: any, row: SalesItem) => (
      <div className="inline-flex ps-2">
        <Checkbox
          value={row.id}
          className="cursor-pointer"
          {...(onChecked && { onChange: (e) => onChecked(e, e.target.value) })}
        />
      </div>
    ),
  },
  {
    title: (
      <HeaderCell
        title="BUY"
        sortable
        ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'X'}
      />
    ),
    dataIndex: 'X',
    key: 'X',
    width: 100,
    onHeaderCell: () => onHeaderCellClick('X'),
    render: (X: string) => (
      <Title as="h6" className="!text-sm font-medium">
        {X}
      </Title>
    ),
  },
  {
    title: (
      <HeaderCell
        title="GET"
        sortable
        ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'Y'}
      />
    ),
    dataIndex: 'Y',
    key: 'Y',
    width: 100,
    onHeaderCell: () => onHeaderCellClick('Y'),
    render: (Y: string) => (
      <Text className="truncate !text-sm">{Y}</Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Expiration"
        sortable
        ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'expiration'}
      />
    ),
    dataIndex: 'expiration',
    key: 'expiration',
    width: 150,
    onHeaderCell: () => onHeaderCellClick('expiration'),
    render: (expiration: string) => (
      <Text className="truncate !text-sm">{expiration}</Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Number of Products"
        sortable
        ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'productCount'}
      />
    ),
    dataIndex: 'product',
    key: 'productCount',
    width: 100,
    render: (products: any[]) => (
      <Text className="truncate !text-sm">{products.length}</Text> // Display the count of products
    ),
  },
  {
    title: <></>,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: any, row: SalesItem) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={'Edit Sale'}
          placement="top"
          color="invert"
        >
          <Link href={`/shared/ecommerce/sales/edit/${row.id}`}>
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the sale`}
          description={`Are you sure you want to delete this #${row.id} sale?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
