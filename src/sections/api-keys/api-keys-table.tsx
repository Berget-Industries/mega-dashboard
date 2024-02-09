import React, { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { Container, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import OrderTableFiltersResult from 'src/sections/tickets/order-table-filters-result';

import { IUser } from 'src/types/user';
import { IAPIKeys } from 'src/types/APIKeys';
import { IOrganization } from 'src/types/organization';
import { IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';
import FilterOrganisationBar from '../users/filter-user-bar';
import APIKeysTableRow, { IAPIKeysTableRow } from './table-row';

// ----------------------------------------------------------------------

interface APIKeysTableProps {
  apiKeys: IAPIKeys[];
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'organizationId', label: 'ID', width: 116 },
  { id: 'organization', label: 'Organisation' },
  { id: 'apiKeyID', label: 'Nyckel', width: 110 },
  { id: '', width: 90 },
];

const defaultFilters: IOrderTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IAPIKeysTableRow[];
  comparator: (a: any, b: any) => number;
  filters: IOrderTableFilters;
  dateError: boolean;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.apiKeys._id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.apiKeys.key.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

export default function APIKeysTable({ apiKeys }: APIKeysTableProps) {
  const table = useTable({ defaultOrderBy: 'date' });
  const [tableData, setTableData] = useState<IAPIKeysTableRow[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedOrg] = useSelectedOrgContext();

  useEffect(() => {
    const currentOrganizationId = selectedOrg?._id;

    const formattedTableData = apiKeys
      .filter((apiKey) => apiKey.organization === currentOrganizationId)
      .map((apiKey) => ({
        _id: apiKey._id,
        apiKeys: {
          _id: apiKey._id || '',
          key: apiKey.key || '',
          organization: apiKey.organization || '',
        },
      }));

    setTableData(formattedTableData);
  }, [apiKeys, selectedOrg]);

  console.log('Här är alla api nycklar: ', apiKeys);
  console.log('här är org id', selectedOrg?._id);

  const [filters, setFilters] = useState(defaultFilters);
  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });
  const denseHeight = table.dense ? 52 : 72;
  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          API Nycklar 🔑
        </Typography>
        <Stack>
          <Button variant="outlined">Lägg till API Nyckel</Button>
        </Stack>
      </Stack>
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.apiKeys.key)
              )
            }
          />
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <APIKeysTableRow
                      key={row.apiKeys.key}
                      row={row}
                      selected={table.selected.includes(row.apiKeys.key)}
                    />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
