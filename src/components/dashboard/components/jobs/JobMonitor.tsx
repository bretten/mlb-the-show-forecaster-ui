import {Box, Card, CardContent, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {useSignalR} from "../../../../contexts/SignalRContext.ts";
import {JobType} from "../../internals/jobDefinitions.ts";
import {JobStatus} from "./JobStatus.tsx";
import {JobStartButton} from "./JobStartButton.tsx";

export interface JobMonitorProps {
    job: JobType;
}

const allowJobChaining = import.meta.env.VITE_ALLOW_JOB_CHAINING === 'true';

/**
 * Represents a component that monitors a background job/service on the server using SignalR and Websockets
 * @param job The job to display
 * @constructor
 */
export const JobMonitor = ({job}: JobMonitorProps) => {
    const {methodsToStates} = useSignalR();

    function camelCaseSplit(camelCase: string) {
        const result = camelCase.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    return (
        <Card variant="outlined" sx={{height: '100%', flexGrow: 1}}>
            <CardContent>
                <Stack
                    spacing={1}
                    direction="column"
                    sx={{justifyContent: 'space-between', flexGrow: '1', gap: 1}}
                >
                    <Stack sx={{justifyContent: 'space-between'}}>
                        <Stack
                            direction="row"
                            sx={{justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography variant="h4" component="p">
                                {job.title}
                            </Typography>
                            {!allowJobChaining && (<JobStartButton job={job}/>)}
                        </Stack>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>
                            {job.desc}
                        </Typography>
                    </Stack>
                    <Stack spacing={2} sx={{width: '100%'}}>
                        <JobStatus state={methodsToStates[job.methodName]}/>
                        <Paper variant="outlined" square={true}
                               sx={{textAlign: 'left', padding: 1, height: 60, overflowY: 'auto'}}>
                            <Typography component="pre" sx={{fontFamily: 'monospace'}}>
                                {
                                    (methodsToStates[job.methodName].data != null) ? (
                                            Object.entries(methodsToStates[job.methodName].data).map(([key, value]) => (
                                                    <Box key={key}>
                                                        <span>{camelCaseSplit(key)}:</span><span>&nbsp;</span>
                                                        <span>{value as string}</span>
                                                        <br/>
                                                    </Box>
                                                )
                                            )
                                        )
                                        : (
                                            <span>{methodsToStates[job.methodName].message}</span>
                                        )
                                }
                            </Typography>
                        </Paper>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}