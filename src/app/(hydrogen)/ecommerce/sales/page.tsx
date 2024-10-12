import React from 'react'
import SalesList from "../../../shared/ecommerce/sales/SalesList"
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { Button } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';


const page = () => {

    const pageHeader = {
        title: 'Create Sale',
        breadcrumb: [
          {
            href: routes.eCommerce.dashboard,
            name: 'E-Commerce',
          },
          {
            href: routes.eCommerce.sales, // Replace with the correct route for sales
            name: 'Sales',
          },
          {
            name: 'Create',
          },
        ],
      };
  return (
    <div>
    
      <SalesList />
    </div>
  )
}

export default page
