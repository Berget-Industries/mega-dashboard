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
import CreateAPIKeyDialog from './createAPIKeyDialog';

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
  const confirm = useBoolean();
  const [tableData, setTableData] = useState<IAPIKeysTableRow[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleToggleDialog = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const formattedTableData = apiKeys.map((apiKey: IAPIKeys) => ({
      _id: apiKey._id,
      apiKeys: {
        _id: apiKey._id || '',
        key: apiKey.key || '',
        organization: apiKey.organization || '',
      },
    }));

    setTableData(formattedTableData);
  }, [apiKeys]);
  console.log('Här är alla api nycklar: ', apiKeys);

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
  const handleFilters = useCallback(
    (name: string, value: IOrderTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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
          <Button onClick={() => setOpen(true)} variant="outlined">
            Lägg till API Nyckel
          </Button>
        </Stack>
      </Stack>
      <Card>
        <FilterOrganisationBar
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />
        {canReset && (
          <OrderTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
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
      {/* <CreateAPIKeyDialog
        open={open}
        handleClose={handleToggleDialog}
        organization={organizations}
      /> */}
    </Container>
  );
}
