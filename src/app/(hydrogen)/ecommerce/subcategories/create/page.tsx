  'use client';

  import React from 'react';
  import CreateCategory from '@/app/shared/ecommerce/category/create-category'; 
  import PageHeader from '@/app/shared/page-header';
  import { Button } from 'rizzui';
  import { routes } from '@/config/routes';
  import Link from 'next/link';

  const pageHeader = {
    title: 'Create A Subcategory',
    breadcrumb: [
      {
        href: routes.eCommerce.dashboard,
        name: 'E-Commerce',
      },
      {
        href: routes.eCommerce.categories,
        name: 'Categories',
      },
      {
        name: 'Create Subcategory',
      },
    ],
  };

  export default function CreateSubcategoryPage() {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link
            href={routes.eCommerce.categories}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto" variant="outline">
              Cancel
            </Button>
          </Link>
        </PageHeader>
        <CreateCategory isModalView={false} /> {/* Ensure this handles subcategory creation */}
      </>
    );
  }
