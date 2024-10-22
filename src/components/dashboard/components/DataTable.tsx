import {
    DataGrid,
    GridColDef,
    GridFilterModel,
    GridLogicOperator,
    GridPaginationModel,
    GridSortModel
} from "@mui/x-data-grid";
import React, {useEffect} from "react";
import Stack from "@mui/material/Stack";
import {Alert, Divider, Pagination} from "@mui/material";
import {URLBuilder} from "../../../utils/URLBuilder.ts";

const pageQueryParam = import.meta.env.VITE_DATA_URI_PAGE_QUERY_PARAM;
const pageSizeQueryParam = import.meta.env.VITE_DATA_URI_PAGE_SIZE_QUERY_PARAM;
const sortFieldQueryParam = import.meta.env.VITE_DATA_URI_SORT_FIELD_QUERY_PARAM;
const sortOrderQueryParam = import.meta.env.VITE_DATA_URI_SORT_ORDER_QUERY_PARAM;
const filterQueryParam = import.meta.env.VITE_DATA_URI_FILTER_QUERY_PARAM;
const credentials = import.meta.env.VITE_HTTP_REQUEST_HEADER_CREDENTIALS;

export interface DataTableProps {
    title: string;
    dataUrl: string;
    columns: GridColDef[];
}

/**
 * Defines a table of data that is sortable and filterable
 * @constructor
 */
export const DataTable = ({title, dataUrl, columns}: DataTableProps) => {
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 20,
    });
    const [rowData, setRowData] = React.useState([]);
    const [rowCount, setRowCount] = React.useState(0);
    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {field: "ovr", sort: 'desc'},
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
        const urlBuilder = new URLBuilder(dataUrl);
        urlBuilder.addQueryParam("season", "2024"); // TODO Replace with season context
        urlBuilder.addQueryParam(pageQueryParam, (paginationModel.page + 1).toString());
        urlBuilder.addQueryParam(pageSizeQueryParam, paginationModel.pageSize.toString());
        if (sortModel.length > 0) {
            const firstSort = sortModel[0]; // Allow only the first sort
            urlBuilder.addQueryParam(sortFieldQueryParam, firstSort.field);
            urlBuilder.addQueryParam(sortOrderQueryParam, firstSort.sort ?? "asc");
        }
        if (filterModel.items.length > 0) {
            const firstFilter = filterModel.items[0];
            urlBuilder.addQueryParam(filterQueryParam, firstFilter.value);
        }

        fetch(urlBuilder.build(), {
            method: 'GET',
            credentials
        })
            .then((response) => response.json())
            .then((json) => {
                setError('');
                setRowData(json.items);
                setRowCount(json.totalItems);
                setTotalPages(json.totalPages);
            })
            .catch(function (error) {
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
            <h1>{title}</h1>
            <DataGrid
                autoHeight
                rows={rowData}
                rowCount={rowCount}
                columns={columns}
                getRowId={(row) => {
                    return row.cardExternalId;
                }}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                    pagination: {paginationModel: paginationModel},
                    sorting: {sortModel: sortModel},
                }}
                pageSizeOptions={[5, 10, 20, 50]}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={(model) => {
                    fetchData(model, sortModel, filterModel);
                    setPaginationModel(model);

                }}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={(model) => {
                    fetchData(paginationModel, model, filterModel);
                    setSortModel(model);
                }}
                filterMode="server"
                filterModel={filterModel}
                onFilterModelChange={(model) => {
                    setFilterModel(model);
                }}
                disableColumnResize
                disableColumnMenu
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
            <Pagination page={paginationModel.page + 1} count={totalPages} variant="outlined" shape="rounded"
                        showFirstButton showLastButton
                        onChange={(_event, page) => {
                            setPaginationModel((prevState) => ({
                                ...prevState,
                                page: page - 1,
                            }));
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