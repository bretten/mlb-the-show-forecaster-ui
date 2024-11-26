import './App.css'
import {Layout} from "./components/Layout.tsx";
import {AuthProvider} from "./components/auth/AuthProvider.tsx";
import {SignalRProvider} from "./components/signalr/SignalRProvider.tsx";
import {SignalRClient} from "./services/SignalRClient.ts";
import {AuthenticationVerification} from "./components/auth/AuthenticationVerification.tsx";
import {SeasonProvider} from "./components/season/SeasonProvider.tsx";
import {LayoutProvider} from "./components/LayoutProvider.tsx";

const signalRClient = new SignalRClient(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_JOBS_URI_SIGNALR);

function App() {
    return (
        <SeasonProvider>
            <AuthProvider>
                <AuthenticationVerification callback={async () => {
                    await signalRClient.reconnect()
                }}/>
                <SignalRProvider client={signalRClient}>
                    <LayoutProvider>
                        <Layout/>
                    </LayoutProvider>
                </SignalRProvider>
            </AuthProvider>
        </SeasonProvider>
    )
}

export default App;
