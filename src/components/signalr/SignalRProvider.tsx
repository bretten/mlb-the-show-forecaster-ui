import React, {useEffect, useState} from "react";
import {SignalRContext} from "../../contexts/SignalRContext.ts";
import {SignalRClient} from "../../services/SignalRClient.ts";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {useAuth} from "../../contexts/AuthContext.ts";
import {JobDefinitions} from "../dashboard/internals/jobDefinitions.ts";
import {JobState} from "../dashboard/internals/jobStates.ts";

const jobsToMonitor = JobDefinitions;

const enqueueSnack = (message: string, variant: "default" | "error" | "success" | "warning" | "info" | undefined) => {
    enqueueSnackbar(message, {
        variant: variant,
        anchorOrigin: {vertical: "bottom", horizontal: "center"}
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

    // When authenticated, connect to SignalR. Otherwise, disconnect
    useEffect(() => {
        if (isAuthenticated) {
            client.start().then(() => {
                // Register all job listeners after connecting
                jobsToMonitor.forEach(async (job) => {
                    client.registerHandler(job.methodName, (value: JobState) => {
                        const jobState = new JobState(value.state, value.message, value.data); // Need to instantiate to access methods
                        if (jobState.isStarted) {
                            enqueueSnack(`Job "${job.title}" started.`, "info");
                        } else if (jobState.isDone) {
                            enqueueSnack(`Job "${job.title}" finished.`, "success");
                        } else if (jobState.isError) {
                            enqueueSnack(`Job "${job.title}": ${jobState.message}`, "error");
                        }
                        setMethodsToStates(prev => ({...prev, [job.methodName]: jobState}));
                    });
                });
            }).catch((error) => {
                enqueueSnack(`Could not connect to job status hub: "${error.message}".`, "error");
            });

        } else { // isAuthenticated = false
            // If not authenticated, remove all listeners
            client.stop().then(() => {
                jobsToMonitor.forEach(async (job) => {
                    client.unregisterHandler(job.methodName);
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