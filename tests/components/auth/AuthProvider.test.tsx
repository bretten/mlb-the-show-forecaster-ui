import React from "react";
import {act, cleanup, render, screen} from "@testing-library/react";
import {afterEach, assert, beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {AuthProvider} from "../../../src/components/auth/AuthProvider";
import {AuthContext} from "../../../src/contexts/AuthContext";

// Nested component that AuthProvider wraps
const TestComponent = () => {
    const authContext = React.useContext(AuthContext);
    return (
        <div>
            <button onClick={() => authContext.login('user1', 'password', () => {
                document.querySelector('#login-success')!.textContent = "success"
            }, () => {
                document.querySelector('#login-failure')!.textContent = "failure"
            })}>Login
            </button>
            <button onClick={() => authContext.logout(() => {
                document.querySelector('#logout')!.textContent = "logged out"
            })}>Logout
            </button>
            <span id="login-success"></span>
            <span id="login-failure"></span>
            <span id="logout"></span>
            <span
                id="auth-result">{authContext.isAuthenticated ? `user: ${authContext.username}, role: ${authContext.role}` : 'not authenticated'}</span>
        </div>
    );
};

describe('AuthProvider', () => {
    // Mock fetch()
    let fetchMock: Mock;

    beforeEach(() => {
        fetchMock = vi.fn();
        // Mock the fetch function in window object (browser-like environment)
        window.fetch = fetchMock;
    });

    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('provides the auth context to nested elements when authenticated', async () => {
        // Mock login response
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValueOnce({role: 'Admins'}),
        });

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        const authResultElement = document.querySelector('#auth-result')
        assert.isNotNull(authResultElement);

        // Invoke login
        await act(async () => {
            screen.getByText('Login').click();
        });

        // Assert login
        expect(authResultElement!.textContent).to.equal('user: user1, role: Admins');
    });

    it('removes the auth context after logging out', async () => {
        // Mock login response
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValueOnce({role: 'Admins'}),
        });
        // Mock logout response
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 204
        });

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        const authResultElement = document.querySelector('#auth-result')
        assert.isNotNull(authResultElement);

        // Invoke login
        await act(async () => {
            screen.getByText('Login').click();
        });
        // Invoke logout
        await act(async () => {
            screen.getByText('Logout').click();
        });

        // Assert logout
        expect(authResultElement!.textContent).to.equal('not authenticated');
    });

    it('invokes login success callback', async () => {
        // Mock login response
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValueOnce({role: 'Admins'}),
        });

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        const loginSuccessElement = document.querySelector('#login-success')
        assert.isNotNull(loginSuccessElement);

        // Invoke login
        await act(async () => {
            screen.getByText('Login').click();
        });

        // Assert login
        expect(loginSuccessElement!.textContent).to.equal('success');
    });

    it('invokes login failure callback', async () => {
        // Mock login response
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        const loginFailureElement = document.querySelector('#login-failure')
        assert.isNotNull(loginFailureElement);

        // Invoke login
        await act(async () => {
            screen.getByText('Login').click();
        });

        // Assert login
        expect(loginFailureElement!.textContent).to.equal('failure');
    });

    it('invokes logout callback', async () => {
        // Mock login response
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValueOnce({role: 'Admins'}),
        });
        // Mock logout response
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 204
        });

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        );

        const logoutElement = document.querySelector('#logout')
        assert.isNotNull(logoutElement);

        // Invoke login
        await act(async () => {
            screen.getByText('Login').click();
        });
        // Invoke logout
        await act(async () => {
            screen.getByText('Logout').click();
        });

        // Assert logout
        expect(logoutElement!.textContent).to.equal('logged out');
    });
});