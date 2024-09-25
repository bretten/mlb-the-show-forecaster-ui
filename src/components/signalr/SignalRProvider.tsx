import React, {useEffect, useState} from "react";
import {SignalRContext} from "../../contexts/SignalRContext.ts";
import {SignalRClient} from "../../services/SignalRClient.ts";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {useAuth} from "../../contexts/AuthContext.ts";
import {JobDefinitions} from "../dashboard/internals/jobDefinitions.ts";
import {JobState} from "../dashboard/internals/jobStates.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const jobsUri = import.meta.env.VITE_JOBS_URI_SIGNALR;
const jobsToMonitor = JobDefinitions;

const signalRClient = new SignalRClient(baseUrl + jobsUri);

const enqueueSnack = (message: string, variant: "default" | "error" | "success" | "warning" | "info" | undefined) => {
    enqueueSnackbar(message, {
        variant: variant,
        anchorOrigin: {vertical: "bottom", horizontal: "center"}
    });
}

/**
 * Provides a SignalR client to the nested components
 * @param children Nested elements that will be able to reference this provider
 * @constructor
 */
export const SignalRProvider = ({children}: { children: React.ReactNode }) => {
    // A mapping of SignalR methods to their corresponding messages
    const [methodsToStates, setMethodsToStates] = useState<Record<string, JobState>>(jobsToMonitor.reduce((previousValue, job) => {
        previousValue[job.methodName] = JobState.createReadyState();
        return previousValue;
    }, {} as Record<string, JobState>));
    const {isAuthenticated} = useAuth();

    // When authenticated, connect to SignalR. Otherwise, disconnect
    useEffect(() => {
        if (isAuthenticated) {
            signalRClient.start().then(() => {
                // Register all job listeners after connecting
                jobsToMonitor.forEach(async (job) => {
                    signalRClient.registerHandler(job.methodName, (value: JobState) => {
                        const jobState = new JobState(value.state, value.message);
                        if (jobState.isStarted) {
                            enqueueSnack(`Job "${job.title}" started.`, "info");
                        } else if (jobState.isDone) {
                            enqueueSnack(`Job "${job.title}" finished.`, "success");
                        } else if (jobState.isError) {
                            enqueueSnack(`Job "${job.title}" encountered an error: ${jobState.message}`, "error");
                        }
                        setMethodsToStates(prev => ({...prev, [job.methodName]: jobState}));
                    });
                });
            }).catch((error) => {
                enqueueSnack(`Could not connect to job status hub: "${error.message}".`, "error");
            });

        } else { // isAuthenticated = false
            // If not authenticated, remove all listeners
            signalRClient.stop().then(() => {
                jobsToMonitor.forEach(async (job) => {
                    signalRClient.unregisterHandler(job.methodName);
                });
            });
        }
    }, [isAuthenticated]);

    return <SignalRContext.Provider value={{
        methodsToStates
    }}>
        {children}
        <SnackbarProvider/>
    </SignalRContext.Provider>
}