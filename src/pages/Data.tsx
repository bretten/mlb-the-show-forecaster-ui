import {DataTable} from "../components/dashboard/components/DataTable.tsx";
import {getGridStringOperators, GridColDef} from "@mui/x-data-grid";

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
            <DataTable columns={columns}/>
        </>
    );
}