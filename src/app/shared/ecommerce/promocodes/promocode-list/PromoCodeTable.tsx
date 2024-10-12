'use client' ;
// src/app/shared/ecommerce/promocodes/promocode-list/PromoCodeTable.tsx
import { useState } from 'react';
import Link from 'next/link';
import { getPromoCodeColumns } from './column';
import TableFooter from './TableFooter';

const promoCodeData = [
  { id: '1', code: 'SUMMER21', discount: '20%', expiryDate: '2021-08-31' },
  { id: '2', code: 'WINTER21', discount: '25%', expiryDate: '2021-12-31' },
  // Add more promo codes as needed
];

const PromoCodeTable = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleDeleteItem = (id: string) => {
    // Handle delete action
  };

  const handleHeaderCellClick = (value: string) => {
    // Handle header cell click
  };

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setCheckedItems((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleDeleteSelected = (ids: string[]) => {
    // Handle bulk delete action
  };

  const columns = getPromoCodeColumns({
    onDeleteItem: handleDeleteItem,
    onHeaderCellClick: handleHeaderCellClick,
    onChecked: handleChecked,
  });

  return (
    <div className="table-container">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <Link href="/shared/ecommerce/promocodes/add">
          <button className="btn btn-primary">Add Promo Code</button>
        </Link>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {promoCodeData.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter checkedItems={checkedItems} handleDelete={handleDeleteSelected} />
    </div>
  );
};

export default PromoCodeTable;
