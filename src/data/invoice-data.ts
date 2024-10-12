export type Invoice = {
  id: string;
  name: string;
  userName: string;
  email: string;
  phone: string;
  dueDate: string;
  amount: string;
  status: string;
  createdAt: Date;
};

export const invoiceData = [
  {
    id: '62447',
    name: 'Francis Sanford MD',
    userName: 'George33',
    email: 'Maryam.Barrows@yahoo.com',
    phone: '123-456-7890',
    dueDate: '2023-10-18T13:24:00.760Z',
    amount: '544.00',
    status: 'Paid',
    createdAt: '2023-01-14T20:37:08.482Z',
  },
  {
    id: '86740',
    name: 'Lucia Kshlerin',
    userName: 'Kenyon_Goldner56',
    email: 'Mason_Davis4@yahoo.com',
    phone: '234-567-8901',
    dueDate: '2023-07-18T01:06:16.095Z',
    amount: '560.00',
    status: 'Pending',
    createdAt: '2023-02-13T22:59:20.038Z',
  },
];
