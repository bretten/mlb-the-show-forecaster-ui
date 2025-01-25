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
import {Alert, Box, Divider, Pagination, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {URLBuilder} from "../../../utils/URLBuilder.ts";
import {useSeason} from "../../../contexts/SeasonContext.ts";
import {TrendReport} from "../types/TrendReport.interface.ts";
import {AddReaction} from "@mui/icons-material";
import Diamond from '../../../assets/shield-diamond.webp';
import Gold from '../../../assets/shield-gold.webp';
import Silver from '../../../assets/shield-silver.webp';
import Bronze from '../../../assets/shield-bronze.webp';
import Common from '../../../assets/shield-common.webp';
import Typography from "@mui/material/Typography";

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
    const {season} = useSeason();
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
    const [isLoading, setIsLoading] = React.useState(false);
    const [cardFilter, setCardFilter] = React.useState('');

    const fetchData = (paginationModel: GridPaginationModel, sortModel: GridSortModel, filterModel: GridFilterModel) => {
        setIsLoading(true);
        const urlBuilder = new URLBuilder(dataUrl);
        urlBuilder.addQueryParam("season", season.toString());
        urlBuilder.addQueryParam(pageQueryParam, (paginationModel.page + 1).toString());
        urlBuilder.addQueryParam(pageSizeQueryParam, paginationModel.pageSize.toString());
        if (cardFilter != null) {
            urlBuilder.addQueryParam("cardFilter", cardFilter);
        }
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
                const reports = json.items.map((item: any) => {
                    return new TrendReport(item.year,
                        item.cardExternalId,
                        item.mlbId,
                        item.cardName,
                        item.primaryPosition,
                        item.overallRating,
                        item.metricsByDate,
                        item.impacts,
                        item.isBoosted,
                        item.orders1H,
                        item.orders24H,
                        item.buyPrice,
                        item.buyPriceChange24H,
                        item.sellPrice,
                        item.sellPriceChange24H,
                        item.score,
                        item.scoreChange2W,
                        item.demand
                    );
                })
                setRowData(reports);
                setRowCount(json.totalItems);
                setTotalPages(json.totalPages);
            })
            .catch(function (error) {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        fetchData(paginationModel, sortModel, filterModel);
    }, [paginationModel, sortModel, filterModel, season, cardFilter]);

    return (
        <Stack
            direction="column"
            sx={{gap: 1, alignItems: 'center', flexGrow: 1, p: 1}}
        >
            <h1>{title}</h1>

            <Stack direction={"row"} display={"flex"} justifyContent={"center"} spacing={2} marginBottom={2}>
                <Typography variant="h5" paddingTop={1}>Filter</Typography>
                <ToggleButtonGroup
                    value={cardFilter}
                    exclusive
                    onChange={(_, value) => setCardFilter(value)}
                    aria-label="Card filter"
                >
                    <ToggleButton value="boosted" aria-label="boosted" style={{outline: "none"}}>
                        <AddReaction/>&nbsp;Supercharged
                    </ToggleButton>
                    <ToggleButton value="diamond" aria-label="diamond" style={{outline: "none"}}>
                        <Box component="img" src={Diamond} alt="Diamond" sx={{height: 25, width: 25}}/>
                        <Box marginLeft={1}>99 - 85</Box>
                    </ToggleButton>
                    <ToggleButton value="gold" aria-label="gold" style={{outline: "none"}}>
                        <Box component="img" src={Gold} alt="Gold" sx={{height: 25, width: 25}}/>
                        <Box marginLeft={1}>84 - 80</Box>
                    </ToggleButton>
                    <ToggleButton value="silver" aria-label="silver" style={{outline: "none"}}>
                        <Box component="img" src={Silver} alt="Silver" sx={{height: 25, width: 25}}/>
                        <Box marginLeft={1}>79 - 75</Box>
                    </ToggleButton>
                    <ToggleButton value="bronze" aria-label="bronze" style={{outline: "none"}}>
                        <Box component="img" src={Bronze} alt="Bronze" sx={{height: 25, width: 25}}/>
                        <Box marginLeft={1}>74 - 65</Box>
                    </ToggleButton>
                    <ToggleButton value="common" aria-label="common" style={{outline: "none"}}>
                        <Box component="img" src={Common} alt="Common" sx={{height: 25, width: 25}}/>
                        <Box marginLeft={1}>64 - 1</Box>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            <Divider/>

            <DataGrid
                loading={isLoading}
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