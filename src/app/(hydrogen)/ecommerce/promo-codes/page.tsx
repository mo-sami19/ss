import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import PromoCodeTable from '@/app/shared/ecommerce/promocodes/promocode-list/PromoCodeTable';

export const metadata = {
  ...metaObject('Blank Page'),
};

const pageHeader = {
  title: 'Promo Code',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'promocode',
    },
  ],
};

export default function BlankPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <PromoCodeTable />
    </>
  );
}
