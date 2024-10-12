import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Activity from '@/app/shared/activity/list';

export const metadata = {
  ...metaObject('Activity Log'),
};

const pageHeader = {
  title: 'Activity Log',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'Activity Log',
    },
  ],
};

// Dummy data for activity log
const activityData = [
  { id: 1, user: 'John Doe', action: 'Created Product', timestamp: '2024-07-16 10:00:00' },
  { id: 2, user: 'Jane Smith', action: 'Updated Order', timestamp: '2024-07-16 11:00:00' },
  // Add more dummy data here
];

export default function ActivityLogPage() {



  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Activity />
    </>
  );
}
