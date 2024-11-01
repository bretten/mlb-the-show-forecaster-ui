import {DataTable} from "../components/dashboard/components/DataTable.tsx";
import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";
import {Box, Modal} from "@mui/material";
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
    const [trendReport, setTrendReport] = useState<TrendReport>(new TrendReport(0, "", 0, "", "", 0, [], []));
    // State for the modal that displays the trend report
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const columns: GridColDef[] = [
        {
            field: 'action',
            headerName: '',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            sortable: false,
            filterable: false,
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
                                params.row.impacts
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
            field: 'name',
            valueGetter: (_value, row) => {
                return row.cardName;
            },
            headerName: 'Name',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            sortable: true,
            filterable: false,
            minWidth: 300,
            filterOperators: filterOperators
        },
        {
            field: 'ovr',
            valueGetter: (_value, row) => {
                return row.overallRating;
            },
            headerName: 'OVR',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            sortable: true,
            filterable: false,
            minWidth: 100,
            filterOperators: filterOperators
        },
        {
            field: 'PrimaryPosition',
            valueGetter: (_value, row) => {
                return row.primaryPosition;
            },
            headerName: 'Pos',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            sortable: false,
            filterable: false,
            minWidth: 100,
            filterOperators: filterOperators
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