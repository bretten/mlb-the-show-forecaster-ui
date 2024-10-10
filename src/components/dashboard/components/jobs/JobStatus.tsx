import Typography from "@mui/material/Typography";
import {Chip} from "@mui/material";
import {JobState} from "../../internals/jobStates.ts";

export interface JobStatusProps {
    state: JobState;
}

/**
 * Represents the status of a job
 * @param status The status
 * @constructor
 */
export const JobStatus = ({state}: JobStatusProps) => {
    return (
        <Typography component="h2" variant="subtitle2" gutterBottom>
            {state.isReady && (<Chip size="small" color="info" label="Ready"/>)}
            {(state.isStarted || state.isInProgress) && (<Chip size="small" color="default" label="In Progress..."/>)}
            {state.isDone && (<Chip size="small" color="success" label="Done"/>)}
            {state.isError && (<Chip size="small" color="error" label="Error"/>)}
        </Typography>
    )
}