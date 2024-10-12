'use client' ;
import React from 'react';
import { useTable, Column } from 'react-table';

// Define the data type
interface ActivityLogEntry {
  timestamp: string;
  action: string;
  email: string;
}

// Sample data
const sampleData: ActivityLogEntry[] = [
  { timestamp: '2024-07-19T12:00:00Z', action: 'Logged in', email: 'user1@example.com' },
  { timestamp: '2024-07-19T12:30:00Z', action: 'Updated profile', email: 'user2@example.com' },
  { timestamp: '2024-07-19T13:00:00Z', action: 'Logged out', email: 'user3@example.com' },
];

const ActivityLog: React.FC = () => {
  // Define columns
  const columns: Column<ActivityLogEntry>[] = React.useMemo(
    () => [
      {
        Header: 'Timestamp',
        accessor: 'timestamp',
      },
      {
        Header: 'Action',
        accessor: 'action',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
    []
  );

  // Use react-table hooks
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: sampleData,  // Use sample data here
  });

  return (
    <div className="p-4">
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  key={column.id}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    key={cell.column.id}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;
