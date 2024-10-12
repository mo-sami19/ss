'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PiDownloadSimpleBold } from 'react-icons/pi';
import PageHeader from '@/app/shared/page-header';
import PrintButton from '@/app/shared/print-button';
import InvoiceDetails from '@/app/shared/invoice/invoice-details';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';

const pageHeader = {
  title: 'Invoice Details',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.invoice.home,
      name: 'Invoice',
    },
    {
      name: 'Details',
    },
  ],
};

export default function InvoiceDetailsPage() {
  const printRef = useRef(null);

  const handleDownload = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice.pdf');
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <PrintButton />
          <Button className="w-full @lg:w-auto" onClick={handleDownload}>
            <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
            Download
          </Button>
        </div>
      </PageHeader>

      <div ref={printRef}>
        <InvoiceDetails />
      </div>
    </>
  );
}
