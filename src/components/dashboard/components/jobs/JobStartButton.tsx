import {JobType} from "../../internals/jobDefinitions.ts";
import IconButton from "@mui/material/IconButton";
import PlayCircleFilled from "@mui/icons-material/PlayCircleFilled";
import {useAuth} from "../../../../contexts/AuthContext.ts";
import {useSignalR} from "../../../../contexts/SignalRContext.ts";
import {useSeason} from "../../../../contexts/SeasonContext.ts";
import {invokeJob} from "../../internals/invokeJob.ts";
import {useLayout} from "../../../../contexts/LayoutContext.ts";

export interface JobStartButtonProps {
    job: JobType;
}

/**
 * Represents a button that starts a job
 * @param job The job that can be started
 * @constructor
 */
export const JobStartButton = ({job}: JobStartButtonProps) => {
    const {isAdmin} = useAuth();
    const {methodsToStates} = useSignalR();
    const {season} = useSeason();
    const {setIsLoading} = useLayout();
    const jobKey = season + job.methodName;

    if (isAdmin) {
        const currentState = methodsToStates[jobKey];
        const isEnabled = currentState.isReady || currentState.isDone || currentState.isError;
        return (
            <IconButton aria-label="Start" onClick={() => {
                setIsLoading(true);
                invokeJob(season, job, () => {
                    setIsLoading(false);
                });
            }} disabled={!isEnabled}>
                <PlayCircleFilled/>
            </IconButton>
        );
    }
    return null;
}