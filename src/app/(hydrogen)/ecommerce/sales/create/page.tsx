import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import CreateEditSales from '@/app/shared/ecommerce/sales/creat-edit/CreateEdit'; // Assuming you have a similar component for sales form
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';

export const metadata = {
  ...metaObject('Create Sale'), // Meta information for the page
};

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

export default function CreateSalePage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.createSale} // Replace with the correct route for creating a sale
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Sale
          </Button>
        </Link>
      </PageHeader>

      <CreateEditSales /> {/* Your sales form component */}
    </>
  );
}
