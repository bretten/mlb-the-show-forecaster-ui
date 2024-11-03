import {JobType} from "./jobDefinitions.ts";
import {enqueueSnackbar} from "notistack";

const baseUrl = import.meta.env.VITE_BASE_URL;
const credentials = import.meta.env.VITE_HTTP_REQUEST_HEADER_CREDENTIALS;

/**
 * Invokes a job
 * @param season The season to invoke the job for
 * @param job The job to invoke
 */
export const invokeJob = (season: number, job: JobType) => {
    fetch(`${baseUrl}${job.jobUri}?season=${season}&jobId=${job.methodName}`, {
        method: 'POST',
        credentials: credentials
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