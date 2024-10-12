import {DataTable} from "../components/dashboard/components/DataTable.tsx";
import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";
import {Box, Modal} from "@mui/material";
import {TrendChart} from "../components/dashboard/components/data/TrendChart.tsx";
import {useState} from "react";
import {TrendReport} from "../components/dashboard/types/TrendReport.interface.ts";
import IconButton from "@mui/material/IconButton";
import {BarChart} from "@mui/icons-material";

const baseUrl = import.meta.env.VITE_BASE_URL;
const playerCardsDataUri = import.meta.env.VITE_DATA_URI_PLAYER_CARDS;

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [trendReport, setTrendReport] = useState<TrendReport>(new TrendReport(0, "", 0, "", "", 0, [], []));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

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
                            setTrendReport(new TrendReport(params.row.Year,
                                params.row.CardExternalId,
                                params.row.MlbId,
                                params.row.CardName,
                                params.row.PrimaryPosition,
                                params.row.OverallRating,
                                params.row.MetricsByDate,
                                params.row.Impacts
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
            field: 'CardName',
            headerName: 'Name',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            minWidth: 100,
            filterOperators: filterOperators
        },
        {
            field: 'OverallRating',
            headerName: 'OVR',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            minWidth: 100,
            filterOperators: filterOperators
        },
        {
            field: 'PrimaryPosition',
            headerName: 'Pos',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            minWidth: 100,
            filterOperators: filterOperators
        }
    ];

    return (
        <>
            <DataTable title="Player Cards" dataUrl={baseUrl + playerCardsDataUri} columns={columns}/>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{...style, width: '75%', textAlign: 'center'}}>
                        <TrendChart trendReport={trendReport}/>
                    </Box>
                </Modal>
            </div>
        </>
    );
}