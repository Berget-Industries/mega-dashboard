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
import { IOrganization, IPlugin } from 'src/types/organization';
import { IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';

import CreateOrgDialog from './createOrgDialog';
import FilterOrganisationBar from './filter-org-bar';
// eslint-disable-next-line import/no-cycle
import OrderTableRow, { IOrganizationTableRow } from './table-row';

// ----------------------------------------------------------------------

interface OrganizationTableProps {
  organizations: IOrganization[];
  users: IUser[];
  organizationData: IOrganizationData;
}

export interface IOrganizationData {
  id: string;
  name: string;
  plugins: IPlugin[];
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'organizationId', label: 'ID', width: 116 },
  { id: 'company', label: 'Organisation' },
  { id: 'users', label: 'Användare', width: 110 },
  { id: 'plugins', label: 'Plugins', width: 90 },
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
  inputData: IOrganizationTableRow[];
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
        order.organization.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.organization.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

export default function OrganizationTable({
  organizations,
  users,
  organizationData,
}: OrganizationTableProps) {
  const table = useTable({ defaultOrderBy: 'date' });
  const confirm = useBoolean();
  const [tableData, setTableData] = useState<IOrganizationTableRow[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleToggleDialog = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const formattedTableData = organizations.map((org: IOrganization) => ({
      id: org._id || '',
      organization: {
        plugins: org.plugins || [],
        id: org._id || '',
        name: org.name || '',
        logoUrl: org.logoUrl || '',
        users: org.users || [],
      },
    }));

    setTableData(formattedTableData);
  }, [organizations]);
  console.log('Här är dina organisationer: ', organizations);

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
          Organisationer 💸
        </Typography>
        <Stack>
          <Button onClick={() => setOpen(true)} variant="outlined">
            Lägg till organisation
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
                tableData.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
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
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      users={users}
                      organizationDataa={organizationData}
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
      <CreateOrgDialog open={open} handleClose={handleToggleDialog} />
    </Container>
  );
}
