import {DataTable} from "../components/dashboard/components/DataTable.tsx";
import {
    getGridStringOperators,
    GridAlignment,
    GridColDef,
    GridColumnHeaderParams,
    GridRenderCellParams
} from "@mui/x-data-grid";
import {Box, Modal, Tooltip} from "@mui/material";
import {TrendChart} from "../components/dashboard/components/data/TrendChart.tsx";
import {useState} from "react";
import {TrendReport} from "../components/dashboard/types/TrendReport.interface.ts";
import IconButton from "@mui/material/IconButton";
import {BarChart} from "@mui/icons-material";

const baseUrl = import.meta.env.VITE_BASE_URL;
const trendReportsDataUri = import.meta.env.VITE_DATA_URI_TREND_REPORTS;

/**
 * Defines a Data UI component
 * - Displays all data in the MLB The Show Forecaster
 *
 * @constructor
 */
export const Data = () => {
    // Remove any filter operators that won't be used
    const filterOperators = getGridStringOperators().filter(({value}) =>
        ['contains'].includes(value),
    );
    // State for the currently selected trend report
    const [trendReport, setTrendReport] = useState<TrendReport>(new TrendReport(0, "", 0, "", "", 0, [], [], 0, 0, 0, 0, 0, 0, 0, 0));
    // State for the modal that displays the trend report
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Cell content for percentage values that need to show green or red text for positive or negative changes
    const getPercentageChangeCellContent = (params: GridRenderCellParams) => {
        const negligibleChangeThreshold = 5;
        const magnitude = Math.abs(params.value);
        let color = 'text.disabled';
        if (magnitude < negligibleChangeThreshold) {
            color = 'text.secondary';
        } else if (params.value > negligibleChangeThreshold) {
            color = 'success.main';
        } else if (params.value < -negligibleChangeThreshold) {
            color = 'error.main';
        }
        return (
            <Box sx={{color: color}}>{params.value}%</Box>
        );
    }

    // Gets a GridColDef
    const getColumnDef = (field: string, header: string, maxWidth: number = 100, minWidth: number = 100, align: GridAlignment = "right"): GridColDef => {
        return {
            field: field,
            headerName: header,
            headerAlign: align,
            align: align,
            hideSortIcons: true,
            sortable: true,
            filterable: false,
            maxWidth: maxWidth,
            minWidth: minWidth,
            filterOperators: filterOperators
        };
    }

    const columns: GridColDef[] = [
        {
            ...getColumnDef('action', '', 50, 50, 'left'),
            sortable: false,
            maxWidth: 50,
            renderCell: (params) => {
                return (
                    <IconButton
                        aria-label={"Chart"}
                        onClick={() => {
                            setTrendReport(new TrendReport(params.row.year,
                                params.row.cardExternalId,
                                params.row.mlbId,
                                params.row.cardName,
                                params.row.primaryPosition,
                                params.row.overallRating,
                                params.row.metricsByDate,
                                params.row.impacts,
                                params.row.orders1H,
                                params.row.orders24H,
                                params.row.buyPrice,
                                params.row.buyPriceChange24H,
                                params.row.sellPrice,
                                params.row.sellPriceChange24H,
                                params.row.score,
                                params.row.scoreChange2W
                            ));
                            handleOpen();
                        }}
                        sx={{
                            border: "none",
                            borderRadius: 0,
                            backgroundColor: "transparent"
                        }}
                    >
                        <BarChart/>
                    </IconButton>
                )
            }
        },
        {
            ...getColumnDef('name', 'Name', 200, 200, 'left'),
            description: 'The player name',
            valueGetter: (_value, row) => {
                return row.cardName;
            },
        },
        {
            ...getColumnDef('overallRating', 'OVR', 50, 50, 'left'),
            description: 'The overall rating of the card',
            valueGetter: (_value, row) => {
                return row.overallRating;
            },
        },
        {
            ...getColumnDef('primaryPosition', 'Pos', 55, 55, 'left'),
            description: 'Primary position of the player card',
            valueGetter: (_value, row) => {
                return row.primaryPosition;
            },
        },
        {
            ...getColumnDef('orders1H', 'Orders (1H)'),
            description: 'The number of orders in the past hour',
            valueGetter: (_value, row) => {
                return row.orders1H;
            },
        },
        {
            ...getColumnDef('orders24H', 'Orders (1D)'),
            description: 'The number of orders in the past 24 hours',
            valueGetter: (_value, row) => {
                return row.orders24H;
            },
        },
        {
            ...getColumnDef('buyPrice', 'Bid'),
            description: 'The current buy price, or the highest bid',
            valueGetter: (_value, row) => {
                return row.buyPrice;
            },
        },
        {
            ...getColumnDef('buyPriceChange24H', 'Bid'),
            description: 'The percentage change of the buy price over the past 24 hours',
            valueGetter: (_value, row) => {
                return row.buyPriceChange24H;
            },
            renderHeader: (params: GridColumnHeaderParams) => (
                <Tooltip title={params.colDef.description}>
                    <span>
                        {params.colDef.headerName}
                        <span style={{fontSize: '14px'}}>Δ (1D)</span>
                    </span>
                </Tooltip>
            ),
            renderCell: getPercentageChangeCellContent
        },
        {
            ...getColumnDef('sellPrice', 'Ask'),
            description: 'The current sell price, or the lowest ask',
            valueGetter: (_value, row) => {
                return row.sellPrice;
            },
        },
        {
            ...getColumnDef('sellPriceChange24H', 'Ask'),
            description: 'The percentage change of the sell price over the past 24 hours',
            valueGetter: (_value, row) => {
                return row.sellPriceChange24H;
            },
            renderHeader: (params: GridColumnHeaderParams) => (
                <Tooltip title={params.colDef.description}>
                    <span>
                        {params.colDef.headerName}
                        <span style={{fontSize: '14px'}}>Δ (1D)</span>
                    </span>
                </Tooltip>
            ),
            renderCell: getPercentageChangeCellContent
        },
        {
            ...getColumnDef('score', 'Score'),
            description: "The player's performance score",
            valueGetter: (_value, row) => {
                return row.score;
            },
        },
        {
            ...getColumnDef('scoreChange2W', 'Score', 105, 105, 'right'),
            description: "The percentage change of the player's performance score over the past two weeks",
            valueGetter: (_value, row) => {
                return row.scoreChange2W;
            },
            renderHeader: (params: GridColumnHeaderParams) => (
                <Tooltip title={params.colDef.description}>
                    <span>
                        {params.colDef.headerName}
                        <span style={{fontSize: '14px'}}>Δ (2W)</span>
                    </span>
                </Tooltip>
            ),
            renderCell: getPercentageChangeCellContent
        }
    ];

    return (
        <>
            <DataTable title="Trend Reports" dataUrl={baseUrl + trendReportsDataUri} columns={columns}/>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        padding: 3,
                        width: '75%',
                        textAlign: 'center'
                    }}>
                        <TrendChart trendReport={trendReport}/>
                    </Box>
                </Modal>
            </div>
        </>
    );
}