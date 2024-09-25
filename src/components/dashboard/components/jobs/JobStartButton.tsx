import {JobType} from "../../internals/jobDefinitions.ts";
import IconButton from "@mui/material/IconButton";
import {PlayCircleFilled} from "@mui/icons-material";
import {useAuth} from "../../../../contexts/AuthContext.ts";
import {useSignalR} from "../../../../contexts/SignalRContext.ts";
import {enqueueSnackbar} from "notistack";

export interface JobStartButtonProps {
    job: JobType;
}

const baseUrl = import.meta.env.VITE_BASE_URL;
const jobsUri = import.meta.env.VITE_JOBS_URI_INVOKE;

/**
 * Represents a button that starts a job
 * @param job The job that can be started
 * @constructor
 */
export const JobStartButton = ({job}: JobStartButtonProps) => {
    const {isAdmin} = useAuth();
    const {methodsToStates} = useSignalR();

    const invokeJob = (jobId: string) => {
        if (!isAdmin) return;

        fetch(`${baseUrl}${jobsUri}?jobId=${jobId}`, {
            method: "POST"
        })
            .then(res => {
                if (res.status === 401) {
                    throw new Error("Unauthorized");
                }
            })
            .catch(function (error) {
                enqueueSnackbar(`Could not start the job: ${error.message}`, {
                    variant: "error",
                    anchorOrigin: {vertical: "bottom", horizontal: "center"}
                })
            });
    }

    if (isAdmin) {
        const currentState = methodsToStates[job.methodName];
        const isEnabled = currentState.isReady || currentState.isDone || currentState.isError;
        return (
            <IconButton aria-label="delete" onClick={() => {
                invokeJob(job.methodName)
            }} disabled={!isEnabled}>
                <PlayCircleFilled/>
            </IconButton>
        );
    }
    return null;
}