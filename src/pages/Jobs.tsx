import Grid from "@mui/material/Grid2";
import {JobMonitor} from "../components/dashboard/components/jobs/JobMonitor.tsx";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {JobDefinitions, JobPlayerStatusTracker} from "../components/dashboard/internals/jobDefinitions.ts";
import {useSignalR} from "../contexts/SignalRContext.ts";
import {JobStartButton} from "../components/dashboard/components/jobs/JobStartButton.tsx";
import {Box} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PlayCircleFilled from "@mui/icons-material/PlayCircleFilled";
import {useAuth} from "../contexts/AuthContext.ts";

const data = JobDefinitions;

/**
 * Defines a Jobs UI component
 * - Displays available background services/jobs and their current status
 * - Allows admins to invoke the jobs
 *
 * @constructor
 */
export const Jobs = () => {
    const {methodsToStates} = useSignalR();
    const {isAdmin} = useAuth();

    // True if the jobs can be started or false if they are already in progress
    const isReady = Object.values(methodsToStates).every(x => x.isReady || x.isDone || x.isError);

    return (
        <Stack direction="column" sx={{gap: 1, alignItems: 'center', flexGrow: 1, p: 1}}>
            <Typography component="h1" variant="h1" sx={{mb: 10}}>
                Jobs
            </Typography>

            {
                isAdmin &&
                (
                    <>
                        {isReady ?
                            (
                                <Box>
                                    <JobStartButton job={JobPlayerStatusTracker}/>
                                </Box>
                            ) :
                            (
                                <Box>
                                    <IconButton aria-label="Start" disabled={true}>
                                        <PlayCircleFilled/>
                                    </IconButton>
                                </Box>
                            )
                        }
                        <Typography>Run all jobs</Typography>
                    </>
                )
            }

            <Grid
                container
                spacing={2}
                columns={12}
                sx={{mb: (theme) => theme.spacing(2)}}
            >
                {data.map((job, index) => (
                    <Grid key={index} size={{xs: 12, sm: 6}}>
                        <JobMonitor job={job}/>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}