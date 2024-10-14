import {Container, createRoot} from "react-dom/client";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act} from "@testing-library/react";
import {AuthContext} from "../../../src/contexts/AuthContext";
import {AuthenticationVerification} from "../../../src/components/auth/AuthenticationVerification";
import {MemoryRouter, useNavigate} from "react-router-dom";

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: vi.fn() as typeof useNavigate,
    };
});

let container: Container | null;
describe('AuthenticationVerification', () => {

    beforeEach(() => {
        vi.useFakeTimers();
        container = document.createElement('div');
        document.body.appendChild(container);
        vi.clearAllTimers();
    });

    afterEach(() => {
        document.body.removeChild(container!);
        container = null;
    });

    it('verifies authentication after the interval has passed', async () => {
        let assertWasCalled = false;
        const mockAuthContext = {
            isAuthenticated: true,
            username: 'user1',
            role: 'Admins',
            isAdmin: true,
            login: vi.fn(),
            logout: vi.fn(),
            verify: (verifySuccessCallback: VoidFunction) => {
                verifySuccessCallback();
                assertWasCalled = true;
            }
        };

        await act(async () => {
            createRoot(container!).render(
                <MemoryRouter>
                    <AuthContext.Provider value={mockAuthContext}>
                        <AuthenticationVerification/>
                    </AuthContext.Provider>
                </MemoryRouter>
            )
        });

        vi.advanceTimersByTime(10000);

        expect(assertWasCalled).toBeTruthy();
    });

    it('redirects to the login screen if authentication fails after the interval has passed', async () => {
        const navCallback = vi.fn();
        useNavigate.mockReturnValue(navCallback);

        const mockAuthContext = {
            isAuthenticated: false,
            username: 'user1',
            role: 'Admins',
            isAdmin: true,
            login: vi.fn(),
            logout: vi.fn(),
            verify: (_verifySuccessCallback: VoidFunction, verifyFailedCallback: VoidFunction) => {
                verifyFailedCallback();
            }
        };

        await act(async () => {
            createRoot(container!).render(
                <MemoryRouter>
                    <AuthContext.Provider value={mockAuthContext}>
                        <AuthenticationVerification/>
                    </AuthContext.Provider>
                </MemoryRouter>
            )
        });

        vi.advanceTimersByTime(10000);

        expect(navCallback).toHaveBeenCalled();
    });
});