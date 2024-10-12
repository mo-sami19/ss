import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import CreateEditPromoCode from '@/app/shared/ecommerce/promocodes/CreateEditPromoCode';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';

export const metadata = {
  ...metaObject('Create Promo Code'),
};

const pageHeader = {
  title: 'Create Promo Code',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.promoCodes,
      name: 'Promo Codes',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreatePromoCodePage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.promoCodes}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Back to Promo Codes
          </Button>
        </Link>
      </PageHeader>

      <CreateEditPromoCode />
    </>
  );
}
