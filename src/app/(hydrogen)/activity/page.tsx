import React from 'react';
import { useTable } from '@tanstack/react-table';
import MainTable from '@/app/shared/activity/list';

const activityLogData = [
  {
    action: 'Login',
    user: 'John Doe',
    timestamp: '2023-07-16 10:00 AM',
    description: 'User logged in',
  },
  {
    action: 'Create Product',
    user: 'Jane Smith',
    timestamp: '2023-07-16 11:30 AM',
    description: 'Created a new product called "Summer T-shirt"',
  },
  // Add more data as needed
];

const activityLogColumns = [
  {
    accessorKey: 'action',
    header: 'Action',
  },
  {
    accessorKey: 'user',
    header: 'User',
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
];

const ActivityLogTable = () => {
  const table = useTable({
    data: activityLogData,
    columns: activityLogColumns,
  });

  return (
    <MainTable
      table={table}
      dataIds={activityLogData.map((_, index) => index)}
      variant="simple"
      isLoading={false}
      showLoadingText={false}
      components={{
        header: undefined,
        headerCell: undefined,
        bodyRow: undefined,
        bodyCell: undefined,
        expandedComponent: undefined,
      }}
    />
  );
};

export default ActivityLogTable;
