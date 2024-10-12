import Ecommerce from '../../app/shared/ecommerce/dashboard/index';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject(),
};

export default function FileDashboardPage() {
  return <Ecommerce/>;
}
