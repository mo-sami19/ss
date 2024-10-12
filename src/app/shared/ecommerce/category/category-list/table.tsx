'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip, ActionIcon, Badge, Text, Checkbox, Input, Button } from 'rizzui';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PencilIcon from '@components/icons/pencil';
import Link from 'next/link';
import DeletePopover from '@/app/shared/delete-popover';
import { routes } from '@/config/routes';
import { HeaderCell } from '@/app/shared/table';

interface Subcategory {
  id: string;
  Cat_id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  active: string;
  created_at: string;
  updated_at: string;
  subcategory: Subcategory[];
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface CategoryTableProps {
  data: Category[];
  isLoading: boolean;
  error: string | null;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  sortConfig?: SortConfig;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const CategoryTable: React.FC<CategoryTableProps> = ({
  data,
  isLoading,
  error,
  onDeleteItem,
  onHeaderCellClick,
  sortConfig,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<Category[]>(data);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFilteredData(
      data.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCategories(new Set(data.map((category) => category.id)));
    } else {
      setSelectedCategories(new Set());
    }
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (e.target.checked) {
      newSelectedCategories.add(id);
    } else {
      newSelectedCategories.delete(id);
    }
    setSelectedCategories(newSelectedCategories);
  };

  const handleDeleteSubcategory = async (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast.error('No authentication token found');
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/SubCategory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Subcategory deleted successfully');
      onDeleteItem(id); // Notify parent component of the deletion
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
        toast.error(`Failed to delete subcategory: ${error.response.data.message}`);
      } else {
        console.error('Error:', error.message);
        toast.error('Failed to delete subcategory');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error(error);
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <ToastContainer />
      <div className="mb-4"></div>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href={routes.eCommerce.createCategory} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
          <Button variant="outline" className="w-full @lg:w-auto">
            Create Category
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <Checkbox onChange={handleSelectAll} checked={selectedCategories.size === data.length} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <HeaderCell
                  title="Category Name"
                  sortable
                  ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'name'}
                  onClick={() => onHeaderCellClick('name')}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <HeaderCell title="Description" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <HeaderCell title="Created At" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <HeaderCell title="Subcategories" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((category) => (
              <React.Fragment key={category.id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      value={category.id}
                      checked={selectedCategories.has(category.id)}
                      onChange={(e) => handleSelectCategory(e, category.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <h6 className="text-sm font-medium">{category.name}</h6>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text className="truncate !text-sm ">{category.description}</Text>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ul className="list-disc list-inside">
                      {category.subcategory.map((sub) => (
                        <li key={sub.id} className="flex items-center justify-between">
                          <Text>{sub.name}</Text>
                          <div className="flex items-center space-x-2">
                            <Tooltip content="Edit Subcategory" placement="top">
                              <Link href={routes.eCommerce.editSubcategory(sub.id)}>
                                <ActionIcon
                                  size="sm"
                                  variant="outline"
                                  aria-label="Edit Subcategory"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </ActionIcon>
                              </Link>
                            </Tooltip>
                            <DeletePopover
                              title="Delete the subcategory"
                              description={`Are you sure you want to delete this subcategory #${sub.id}?`}
                              onDelete={() => handleDeleteSubcategory(sub.id)}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Tooltip content="Edit Category" placement="top">
                        <Link href={routes.eCommerce.editCategory(category.id)}>
                          <ActionIcon
                            size="sm"
                            variant="outline"
                            aria-label="Edit Category"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </ActionIcon>
                        </Link>
                      </Tooltip>
                      <DeletePopover
                        title="Delete the category"
                        description={`Are you sure you want to delete this category #${category.id}?`}
                        onDelete={() => onDeleteItem(category.id)}
                      />
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={6}>
                Total Categories: {filteredData.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
