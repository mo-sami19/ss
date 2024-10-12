'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Checkbox, Title, Text, Tooltip, ActionIcon } from 'rizzui';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import ControlledTable from '@/app/shared/controlled-table/index';
import { routes } from '@/config/routes';

const TableFooter = dynamic(
  () => import('@/app/shared/ecommerce/category/category-list/table-footer'),
  { ssr: false }
);

const AdvancedCategoryTable = ({ categories }) => {
  const [data, setData] = useState(categories);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setData(categories);
  }, [categories]);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [data, sortConfig]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = useMemo(() => {
    let filtered = sortedData;
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return filtered;
  }, [sortedData, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (ids: string[]) => {
    setData((prevData) => prevData.filter((item) => !ids.includes(item.id)));
  };

  const columns = useMemo(() => [
    {
      title: <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setCheckedItems(data.map(item => item.id));
                  } else {
                    setCheckedItems([]);
                  }
                }}
                checked={checkedItems.length === data.length}
              />,
      dataIndex: 'checked',
      key: 'checked',
      width: 30,
      render: (_: any, row: any) => (
        <Checkbox
          value={row.id}
          onChange={(e) => {
            if (e.target.checked) {
              setCheckedItems((prevItems) => [...prevItems, row.id]);
            } else {
              setCheckedItems((prevItems) => prevItems.filter((item) => item !== row.id));
            }
          }}
          checked={checkedItems.includes(row.id)}
        />
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: any, row: any) => (
        <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
          <Image
            alt={row.name}
            src={image}
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </figure>
      ),
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string) => (
        <Title as="h6" className="!text-sm font-medium">
          {name}
        </Title>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (description: string) => (
        <Text className="truncate !text-sm">{description}</Text>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      width: 120,
      render: (products: any) => <div className="text-center">{products}</div>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (_: string, row: any) => (
        <div className="flex items-center justify-end gap-3 pe-4">
          <Tooltip
            size="sm"
            content={'Edit Category'}
            placement="top"
            color="invert"
          >
            <Link href={routes.eCommerce.editCategory(row.id)}>
              <ActionIcon size="sm" variant="outline">
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <DeletePopover
            title={`Delete the category`}
            description={`Are you sure you want to delete this #${row.id} category?`}
            onDelete={() => handleDelete([row.id])}
          />
        </div>
      ),
    },
  ], [checkedItems, data]);

  return (
    <ControlledTable
      variant="modern"
      isLoading={false}
      showLoadingText={true}
      data={paginatedData}
      columns={columns}
      paginatorOptions={{
        pageSize,
        setPageSize,
        total: filteredData.length,
        current: currentPage,
        onChange: handlePaginate,
      }}
      filterOptions={{
        searchTerm,
        onSearchClear: () => setSearchTerm(''),
        onSearchChange: handleSearch,
        hasSearched: searchTerm !== '',
        columns,
        checkedColumns: columns,
        setCheckedColumns: () => {},
      }}
      tableFooter={
        <TableFooter
          checkedItems={checkedItems}
          handleDelete={(ids: string[]) => {
            handleDelete(ids);
            setCheckedItems([]);
          }}
        />
      }
      className="rounded-md border border-muted text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
    />
  );
};

export default AdvancedCategoryTable;
