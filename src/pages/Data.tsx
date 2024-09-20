import {DataTable} from "../components/dashboard/components/DataTable.tsx";
import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";

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

    return (
        <>
            <DataTable title="Player Cards" dataUrl={baseUrl + playerCardsDataUri} columns={columns}/>
        </>
    );
}