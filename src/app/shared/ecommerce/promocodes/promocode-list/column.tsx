
"use client";
import Link from 'next/link';
import { routes } from '@/config/routes';
import { HeaderCell } from '@/app/shared/table';
import { Checkbox, Title, Text, Tooltip, ActionIcon } from 'rizzui';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
 
interface PromoCode {
  id: string;
  code: string;
  discount: string;
  expiryDate: string;
}

type Columns = {
  sortConfig?: any;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};

export  const getPromoCodeColumns = ({
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
    render: (_: any, row: PromoCode) => (
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
        title="Promo Code"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'code'
        }
      />
    ),
    dataIndex: 'code',
    key: 'code',
    width: 200,
    onHeaderCell: () => onHeaderCellClick('code'),
    render: (code: string) => (
      <Title as="h6" className="!text-sm font-medium">
        {code}
      </Title>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Discount"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'discount'
        }
      />
    ),
    dataIndex: 'discount',
    key: 'discount',
    width: 100,
    onHeaderCell: () => onHeaderCellClick('discount'),
    render: (discount: string) => (
      <Text className="truncate !text-sm ">{discount}</Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Expiry Date"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'expiryDate'
        }
      />
    ),
    dataIndex: 'expiryDate',
    key: 'expiryDate',
    width: 150,
    onHeaderCell: () => onHeaderCellClick('expiryDate'),
    render: (expiryDate: string) => (
      <Text className="truncate !text-sm ">{expiryDate}</Text>
    ),
  },
  {
    title: <></>,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: string, row: PromoCode) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={'Edit Promo Code'}
          placement="top"
          color="invert"
        >
          <Link href={routes.eCommerce.editPromoCode(row.id)}>
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the promo code`}
          description={`Are you sure you want to delete this #${row.id} promo code?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
