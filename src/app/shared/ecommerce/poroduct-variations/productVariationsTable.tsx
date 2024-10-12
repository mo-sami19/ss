// src/app/shared/ecommerce/product/create-edit/VariationsTable.tsx
import { Table , ActionIcon } from 'rizzui';
import { TrashIcon } from '@components/icons/trash';

export default function VariationsTable({ variations, onRemove }) {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Variant Name</Table.Cell>
          <Table.Cell>Variant Size</Table.Cell>
          <Table.Cell>Actions</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {variations.map((variant, index) => (
          <Table.Row key={index}>
            <Table.Cell>{variant.name}</Table.Cell>
            <Table.Cell>{variant.value}</Table.Cell>
            <Table.Cell>
              <ActionIcon onClick={() => onRemove(index)}>
                <TrashIcon className="h-4 w-4" />
              </ActionIcon>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
