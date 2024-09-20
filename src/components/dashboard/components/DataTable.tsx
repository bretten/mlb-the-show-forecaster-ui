import {
    DataGrid,
    getGridStringOperators,
    GridColDef,
    GridFilterModel,
    GridLogicOperator,
    GridPaginationModel,
    GridSortModel
} from "@mui/x-data-grid";
import React, {useEffect} from "react";
import Stack from "@mui/material/Stack";
import {Alert, Divider, Pagination} from "@mui/material";

const baseUrl = import.meta.env.VITE_BASE_URL;
const dataUrl = import.meta.env.VITE_DATA_URI;

// Remove any filter operators that won't be used
const filterOperators = getGridStringOperators().filter(({value}) =>
    ['contains'].includes(value),
);
const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 100,
        filterable: false
    },
    {
        field: 'name',
        headerName: 'Name',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 100,
        filterOperators: filterOperators
    }
];

/**
 * Defines a table of data that is sortable and filterable
 * @constructor
 */
export const DataTable = () => {
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 20,
    });
    const [rowData, setRowData] = React.useState([]);
    const [rowCount, setRowCount] = React.useState(0);
    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {field: 'id', sort: 'asc'},
    ]);
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
        items: [],
        logicOperator: GridLogicOperator.And,
        quickFilterLogicOperator: GridLogicOperator.And,
        quickFilterValues: []
    });
    const [totalPages, setTotalPages] = React.useState(0);
    const [error, setError] = React.useState('');

    const fetchData = (paginationModel: GridPaginationModel, sortModel: GridSortModel, filterModel: GridFilterModel) => {
        let url = baseUrl + dataUrl + "?page=" + (paginationModel.page + 1)
            + "&pageSize=" + paginationModel.pageSize;
        if (sortModel.length > 0) {
            const firstSort = sortModel[0]; // Allow only the first sort
            url = url + "&sortField=" + firstSort.field
                + "&sortOrder=" + firstSort.sort;
        }
        if (filterModel.items.length > 0) {
            const firstFilter = filterModel.items[0];
            url = url + "&filter=" + firstFilter.value;
        }

        fetch(url, {
            method: "GET",
            credentials: "include"
        })
            .then((response) => response.json())
            .then((json) => {
                setError('');
                setRowData(json.items);
                setRowCount(json.totalItems);
                setTotalPages(json.totalPages);
            })
            .catch(function (error) {
                console.log(error);
                setError(error.message);
            });
    }

    useEffect(() => {
        fetchData(paginationModel, sortModel, filterModel);
    }, [paginationModel, sortModel, filterModel]);

    return (
        <Stack
            direction="column"
            sx={{gap: 1, alignItems: 'center', flexGrow: 1, p: 1}}
        >
            <DataGrid
                autoHeight
                rows={rowData}
                rowCount={rowCount}
                columns={columns}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                    pagination: {paginationModel: paginationModel},
                    sorting: {sortModel: sortModel},
                }}
                paginationMode="server"
                pageSizeOptions={[5, 10, 20, 50]}
                onPaginationModelChange={(model) => {
                    fetchData(model, sortModel, filterModel);
                    setPaginationModel(model);
                }}
                sortingMode="server"
                onSortModelChange={(model) => {
                    fetchData(paginationModel, model, filterModel);
                    setSortModel(model);
                }}
                sortModel={sortModel}
                filterMode="server"
                onFilterModelChange={(model) => {
                    setFilterModel(model);
                }}
                disableColumnResize
                density="compact"
                slotProps={{
                    filterPanel: {
                        filterFormProps: {
                            logicOperatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                            columnInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: {mt: 'auto'},
                            },
                            operatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: {mt: 'auto'},
                            },
                            valueInputProps: {
                                InputComponentProps: {
                                    variant: 'outlined',
                                    size: 'small',
                                },
                            },
                        },
                    },
                }}
            />
            <Divider/>
            <Pagination count={totalPages} variant="outlined" shape="rounded" showFirstButton showLastButton
                        onChange={(_event, page) => {
                            const updatedPaginationModel = {
                                page: page - 1,
                                pageSize: paginationModel.pageSize,
                            }
                            setPaginationModel(updatedPaginationModel);
                        }}/>
            {error && (
                <div>
                    <Divider/>
                    <Alert severity="error">{error}</Alert>
                    <Divider/>
                </div>
            )}

        </Stack>
    );
}