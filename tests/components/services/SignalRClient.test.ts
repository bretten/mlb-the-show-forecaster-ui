import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {HubConnection} from "@microsoft/signalr";
import {SignalRClient} from "../../../src/services/SignalRClient";

vi.mock('@microsoft/signalr', async () => {
    const actual = await vi.importActual('@microsoft/signalr');

    const mockHubConnection = {
        start: vi.fn().mockResolvedValue(undefined),
        stop: vi.fn().mockResolvedValue(undefined),
        on: vi.fn(),
        off: vi.fn(),
        onclose: vi.fn()
    };

    const mockHubConnectionBuilder = {
        withUrl: vi.fn().mockReturnThis(),
        withAutomaticReconnect: vi.fn().mockReturnThis(),
        build: vi.fn().mockReturnValue(mockHubConnection),
    };

    return {
        ...actual,
        HubConnection: mockHubConnection,
        HubConnectionBuilder: vi.fn(() => mockHubConnectionBuilder),
    };
});

describe('SignalRClient', () => {
    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('registers handlers', () => {
        const client = new SignalRClient("");

        const method = "onNotify";
        const mockCallback = vi.fn();

        HubConnection.on.mockImplementation((method, callback) => {
            callback();
        });

        client.registerHandler(method, mockCallback);
        client.registerHandler(method, mockCallback); // The 2nd time will not re-register

        expect(mockCallback).toBeCalledTimes(1);
    });

    it('unregisters handlers', () => {
        const client = new SignalRClient("");

        const method = "onNotify";
        const mockCallback = vi.fn();

        HubConnection.on.mockImplementation(() => {
        });
        HubConnection.off.mockImplementation(() => {
            mockCallback();
        });

        client.registerHandler(method, mockCallback);
        client.unregisterHandler(method);

        expect(mockCallback).toBeCalledTimes(1);
    });

    it('reconnects and re-registers handlers', async () => {
        const client = new SignalRClient("");

        const method = "onNotify";
        const mockCallback = vi.fn();

        HubConnection.on.mockImplementation((method, callback) => {
            callback();
        });

        // Invokes the callback once
        client.registerHandler(method, mockCallback);

        // Invokes the callback again
        await client.reconnect();

        expect(mockCallback).toBeCalledTimes(2);
    });
})