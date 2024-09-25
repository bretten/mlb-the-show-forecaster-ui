import {Card, CardContent, Chip, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {useSignalR} from "../../../contexts/SignalRContext.ts";
import {JobType} from "../internals/jobDefinitions.ts";

export interface JobMonitorProps {
    job: JobType;
}

/**
 * Represents a component that monitors a background job/service on the server using SignalR and Websockets
 * @param job The job to display
 * @constructor
 */
export const JobMonitor = ({job}: JobMonitorProps) => {
    const {methodsToStates} = useSignalR();

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
                        </Stack>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>
                            {job.desc}
                        </Typography>
                    </Stack>
                    <Stack spacing={2} sx={{width: '100%'}}>
                        <Typography component="h2" variant="subtitle2" gutterBottom>
                            {(methodsToStates[job.methodName] == "" || methodsToStates[job.methodName] == undefined) && (
                                <Chip size="small" color="info" label="Ready"/>)}
                            {methodsToStates[job.methodName] != ""
                                && methodsToStates[job.methodName] != "Done"
                                && methodsToStates[job.methodName] != undefined
                                && methodsToStates[job.methodName] != "Error"
                                && (<Chip size="small" color="default" label="In Progress..."/>)}
                            {methodsToStates[job.methodName] == "Error" && (
                                <Chip size="small" color="error" label="Error"/>)}
                            {methodsToStates[job.methodName] == "Done" && (
                                <Chip size="small" color="success" label="Done"/>)}
                        </Typography>
                        <Paper variant="outlined" square={true} sx={{textAlign: 'left', padding: 1}}>
                            <Typography component="code">{methodsToStates[job.methodName] ?? "..."}</Typography>
                        </Paper>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}