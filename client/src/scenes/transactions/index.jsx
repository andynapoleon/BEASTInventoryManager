import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { useSelector } from "react-redux";

const Transactions = () => {
  const theme = useTheme();
  const token = useSelector((state) => state.global.token);

  // values to be sent to the backend
  // const [page, setPage] = useState(0);
  // const [pageSize, setPageSize] = useState(20);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleSortModelChange = React.useCallback((sortModel) => {
    // Here you save the data you need from the sort model
    //onst finalModel = sortModel[0].field;
    //console.log(finalModel);
    setSort(...sortModel);
  }, []);

  //console.log(sort.model.field);

  const { data, isLoading } = useGetTransactionsQuery({
    // params that we send to the back-end
    paginationModel,
    // sort: JSON.stringify(sort), // make it a JSON object a string "{...}"
    sort,
    search,
    token,
  });

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length, // grab # of products the transaction has
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`, // only 2 decimal places
      // we're sorting for strings so it's not from lowest to highest because the "cost" field is string (should have been number though)
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={columns}
          // all of the props below are for server-side pagination
          rowCount={(data && data.total) || 0}
          pageSizeOptions={[20, 50, 100]}
          pagination
          paginationModel={paginationModel}
          paginationMode="server"
          sortingMode="server"
          onPaginationModelChange={setPaginationModel}
          onSortModelChange={handleSortModelChange}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
