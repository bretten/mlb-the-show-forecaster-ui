import Grid from "@mui/material/Grid2";
import {JobMonitor} from "../components/dashboard/components/jobs/JobMonitor.tsx";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {JobDefinitions} from "../components/dashboard/internals/jobDefinitions.ts";

const data = JobDefinitions;

/**
 * Defines a Jobs UI component
 * - Displays available background services/jobs and their current status
 * - Allows admins to invoke the jobs
 *
 * @constructor
 */
export const Jobs = () => {
    return (
        <Stack direction="column" sx={{gap: 1, alignItems: 'center', flexGrow: 1, p: 1}}>
            <Typography component="h1" variant="h1" sx={{mb: 10}}>
                Jobs
            </Typography>

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