'use client';

import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { Badge, Title, Text } from 'rizzui';
import Table from '@/app/shared/table';
import { siteConfig } from '@/config/site.config';

const invoiceItems = [
  {
    id: '1',
    product: {
      title: 'ChawkBazar Laravel Flutter Mobile App',
      },
    quantity: 2,
    unitPrice: 100,
    total: 200,
  },
  {
    id: '2',
    product: {
      title: 'Borobazar React Next Grocery Template',
    },
    quantity: 2,
    unitPrice: 100,
    total: 200,
  },
  {
    id: '3',
    product: {
      title: 'Superprops React Modern Landing Page Template',
     
    },
    quantity: 3,
    unitPrice: 100,
    total: 300,
  },
];

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: 'Item',
    dataIndex: 'product',
    key: 'product',
    width: 250,
    render: (product: any) => (
      <>
        <Title as="h6" className="mb-0.5 text-sm font-medium">
          {product.title}
        </Title>
        <Text
          as="p"
          className=" max-w-[250px] overflow-hidden truncate text-sm text-gray-500"
        >
          {product.description}
        </Text>
      </>
    ),
  },

  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 200,
  },
  {
    title: 'Unit Price',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 200,
    render: (value: string) => <Text className="font-medium"> {value} EGP</Text>,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: 200,
    render: (value: string) => <Text className="font-medium"> {value} EGP</Text>,
  },
];

function InvoiceDetailsListTable() {
  return (
    <Table
      data={invoiceItems}
      columns={columns}
      variant="minimal"
      rowKey={(record) => record.id}
      scroll={{ x: 660 }}
      className="mb-11"
    />
  );
}

export default function InvoiceDetails() {
  return (
    <div className="w-full rounded-xl border border-muted p-5 text-sm sm:p-6 lg:p-8 2xl:p-10">
      <div className="mb-12 flex flex-col-reverse items-start justify-between md:mb-16 md:flex-row">
        <Image
          src={siteConfig.logo}
          alt={siteConfig.title}
          className="dark:invert"
          priority
        />
        <div className="mb-4 md:mb-0">
          <Badge
            variant="flat"
            color="success"
            rounded="md"
            className="mb-3 md:mb-2"
          >
            Paid
          </Badge>
          <Title as="h6">INV - #246098</Title>
          <Text className="mt-0.5 text-gray-500">Invoice Number</Text>
        </div>
      </div>

      <div className="mb-12 grid gap-4 xs:grid-cols-2 sm:grid-cols-3 sm:grid-rows-1">
        <div className="">
          <Title as="h6" className="mb-3.5 font-semibold">
            From
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            REDQ, INC
          </Text>
          <Text className="mb-1.5">Jerome Bell</Text>
          <Text className="mb-1.5">
            4140 Parker Rd. Allentown, <br /> New Mexico 31134
          </Text>
          <Text className="mb-4 sm:mb-6 md:mb-8">(302) 555-0107</Text>
          <div>
            <Text className="mb-2 text-sm font-semibold">Creation Date</Text>
            <Text>Mar 22, 2013</Text>
          </div>
        </div>

        <div className="mt-4 xs:mt-0">
          <Title as="h6" className="mb-3.5 font-semibold">
            Bill To
          </Title>
          <Text className="mb-1.5 text-sm font-semibold uppercase">
            TRANSPORT LLC
          </Text>
          <Text className="mb-1.5">Albert Flores</Text>
          <Text className="mb-1.5">
            2715 Ash Dr. San Jose, <br />
            South Dakota 83475
          </Text>
          <Text className="mb-4 sm:mb-6 md:mb-8">(671) 555-0110</Text>
          <div>
            <Text className="mb-2 text-sm font-semibold">Due Date</Text>
            <Text>Mar 22, 2013</Text>
          </div>
        </div>

        <div className="mt-4 flex sm:mt-6 md:mt-0 md:justify-end">
          <QRCodeSVG
            value="https://kogear.shop/"
            className="h-28 w-28 lg:h-32 lg:w-32"
          />
        </div>
      </div>

      <InvoiceDetailsListTable />

      <div className=" ">
      
        <div className=" w-full">
          <Text className="flex items-center justify-between border-b border-muted pb-3.5 lg:pb-5">
            Subtotal:{' '}
            <Text as="span" className="font-semibold">
              700 EGP
            </Text>
          </Text>
          <Text className="flex items-center justify-between border-b border-muted py-3.5 lg:py-5">
            Shipping:{' '}
            <Text as="span" className="font-semibold">
              142 EGP
            </Text>
          </Text>
          <Text className="flex items-center justify-between border-b border-muted py-3.5 lg:py-5">
            Discount:{' '}
            <Text as="span" className="font-semibold">
               250 EGP
            </Text>
          </Text>
          <Text className="flex items-center justify-between border-b border-muted py-3.5 lg:py-5">
            Taxes:
            <Text as="span" className="font-semibold">
              14%
            </Text>
          </Text>
          <Text className="flex items-center justify-between pt-4 text-base font-semibold text-gray-900 lg:pt-5">
            Total: <Text as="span"> 659.5 EGP</Text>
          </Text>
        </div>
      </div>
    </div>
  );
}
