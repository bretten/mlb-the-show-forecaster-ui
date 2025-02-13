import React, {useEffect, useState} from "react";
import {SignalRContext} from "../../contexts/SignalRContext.ts";
import {SignalRClient} from "../../services/SignalRClient.ts";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {useAuth} from "../../contexts/AuthContext.ts";
import {JobDefinitions, JobType} from "../dashboard/internals/jobDefinitions.ts";
import {JobState} from "../dashboard/internals/jobStates.ts";
import {invokeJob} from "../dashboard/internals/invokeJob.ts";
import {useSeason} from "../../contexts/SeasonContext.ts";

const jobsToMonitor = JobDefinitions;
const currentStateMethodName: string = "CurrentState";
const allowJobChaining = import.meta.env.VITE_ALLOW_JOB_CHAINING === 'true';

const enqueueSnack = (message: string, variant: "default" | "error" | "success" | "warning" | "info" | undefined) => {
    enqueueSnackbar(message, {
        variant: variant,
        anchorOrigin: {vertical: "bottom", horizontal: "center"}
    });
}

const registerHandlers = (client: SignalRClient, jobsToMonitor: JobType[], season: number, setMethodsToStates: React.Dispatch<React.SetStateAction<Record<string, JobState>>>) => {
    client.start().then(async () => {
        // Register all job listeners after connecting
        for (const job of jobsToMonitor) {
            client.registerHandler(job.methodName, (value: JobState) => {
                const jobState = new JobState(value.state, value.message, value.data); // Need to instantiate to access methods
                if (jobState.isStarted) {
                    enqueueSnack(`Job "${job.title}" started.`, "info");
                } else if (jobState.isDone) {
                    enqueueSnack(`Job "${job.title}" finished.`, "success");
                    if (allowJobChaining && job.nextJob != null) invokeJob(season, job.nextJob, () => {
                    });
                } else if (jobState.isError) {
                    enqueueSnack(`Job "${job.title}": ${jobState.message}`, "error");
                }
                setMethodsToStates(prev => ({...prev, [job.methodName]: jobState}));
            });
        }

        // Get the initial state from the hub and update the provider's state
        const initialState = await client.invoke(currentStateMethodName);
        Object.entries(initialState).forEach(([key, value]: [string, any]) => {
            const jobState = new JobState(value.state, value.message, value.data as never); // Need to instantiate to access methods
            setMethodsToStates(prev => ({...prev, [key]: jobState}));
        });
    }).catch((error) => {
        enqueueSnack(`Could not connect to job status hub: "${error.message}".`, "error");
    });
}

const unregisterHandlers = (client: SignalRClient, jobsToMonitor: JobType[]) => {
    jobsToMonitor.forEach(async (job) => {
        client.unregisterHandler(job.methodName);
    });
}

/**
 * Provides a SignalR client to the nested components
 * @param children Nested elements that will be able to reference this provider
 * @param client The SignalR client
 * @constructor
 */
export const SignalRProvider = ({children, client}: { children: React.ReactNode, client: SignalRClient }) => {
    // A mapping of SignalR methods to their corresponding messages
    const [methodsToStates, setMethodsToStates] = useState<Record<string, JobState>>(jobsToMonitor.reduce((previousValue, job) => {
        previousValue[job.methodName] = JobState.createReadyState();
        return previousValue;
    }, {} as Record<string, JobState>));
    const {isAuthenticated} = useAuth();
    const {season} = useSeason();

    // When authenticated, connect to SignalR. Otherwise, disconnect
    useEffect(() => {
        if (client.isConnected()) {
            client.stop().then(() => {
                unregisterHandlers(client, jobsToMonitor);
                if (isAuthenticated) registerHandlers(client, jobsToMonitor, season, setMethodsToStates);
            });
            return;
        }

        if (isAuthenticated) {
            registerHandlers(client, jobsToMonitor, season, setMethodsToStates);
        }
    }, [client, isAuthenticated, season]);

    return <SignalRContext.Provider value={{
        methodsToStates
    }}>
        {children}
        <SnackbarProvider/>
    </SignalRContext.Provider>
}