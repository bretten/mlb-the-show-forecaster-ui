import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";

const withCredentials = (import.meta.env.VITE_HTTP_REQUEST_HEADER_CREDENTIALS as string) == "include"
    || (import.meta.env.VITE_HTTP_REQUEST_HEADER_CREDENTIALS as string) == "same-origin";

/**
 * SignalR client
 */
export class SignalRClient {
    private connection: HubConnection;
    private readonly hubUrl: string;
    private readonly methods: { [name: string]: (((...args: any[]) => void) | ((...args: any[]) => any))[] };

    constructor(hubUrl: string) {
        this.hubUrl = hubUrl;
        this.methods = {};

        this.connection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                withCredentials: withCredentials,
                transport: HttpTransportType.WebSockets,
            })
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

    public start(): Promise<void> {
        return this.connection.start();
    }

    public stop(): Promise<void> {
        return this.connection.stop();
    }

    /**
     * Disconnects from the current connection, creates a new connection, and then re-registers the handlers
     * that were registered on the previous connection
     */
    public async reconnect(): Promise<void> {
        await this.stop();
        this.connection = new HubConnectionBuilder()
            .withUrl(this.hubUrl)
            .withAutomaticReconnect()
            .build();
        await this.connection.start();
        for (const method in this.methods) {
            const handlers = this.methods[method];
            for (const handler of handlers) {
                this.connection.on(method, handler);
            }
        }
    }

    /**
     * Registers a handler for the specified method
     * @param method The SignalR method
     * @param callback The callback to invoke when receiving a message from the SignalR method
     */
    public registerHandler(method: string, callback: (...args: any[]) => any): void
    public registerHandler(method: string, callback: (...args: any[]) => void): void {
        if (!method || !callback) {
            return;
        }

        method = method.toLowerCase();
        if (!this.methods[method]) {
            this.methods[method] = [];
        }

        if (this.methods[method].indexOf(callback) !== -1) { // No need if it already exists
            return;
        }

        this.methods[method].push(callback);
        this.connection.on(method, callback);
    }

    /**
     * Unregisters a handler for the specified method
     * @param method The SignalR method
     */
    public unregisterHandler(method: string) {
        if (!method) {
            return;
        }

        method = method.toLowerCase();
        const handlers = this.methods[method];
        if (!handlers) {
            return;
        }
        delete this.methods[method];
        this.connection.off(method);
    }

    /**
     * Invokes a method on the SignalR connection
     * @param method The SignalR method to invoke
     */
    public invoke(method: string): Promise<any> {
        return this.connection.invoke(method);
    }
}