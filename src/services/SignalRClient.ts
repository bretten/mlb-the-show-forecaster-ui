import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";

/**
 * SignalR client
 */
export class SignalRClient {
    private readonly connection: HubConnection;

    constructor(hubUrl: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .build();

        // Need resilience, indefinitely try to reconnect if disconnected due to error.
        this.connection.onclose(async (error) => {
            if (!error) return; // No error, so was a valid disconnect

            // Small delay, but no exponential backoff needed
            await new Promise(res => setTimeout(res, 10000));
            return this.start();
        });
    }

    start(): Promise<void> {
        return this.connection.start();
    }

    stop(): Promise<void> {
        return this.connection.stop();
    }

    /**
     * Registers a handler for the specified method
     * @param method The SignalR method
     * @param callback The callback to invoke when receiving a message from the SignalR method
     */
    registerHandler(method: string, callback: (...args: any[]) => void) {
        this.connection.on(method, callback);
    }

    /**
     * Unregisters a handler for the specified method
     * @param method The SignalR method
     */
    unregisterHandler(method: string) {
        this.connection.off(method);
    }
}