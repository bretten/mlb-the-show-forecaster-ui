import React from "react";
import {JobState} from "../components/dashboard/internals/jobStates.ts";

/**
 * Defines the SignalR context
 */
export interface SignalRContextType {
    /**
     * A mapping of the SignalR method name to its resulting message
     */
    methodsToStates: Record<string, JobState>;
}

/**
 * Context for the SignalR client
 */
export const SignalRContext = React.createContext<SignalRContextType>(null!);

export const useSignalR = () => {
    return React.useContext(SignalRContext);
}