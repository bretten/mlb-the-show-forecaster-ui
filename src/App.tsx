import './App.css'
import {Layout} from "./components/Layout.tsx";
import {AuthProvider} from "./components/auth/AuthProvider.tsx";
import {SignalRProvider} from "./components/signalr/SignalRProvider.tsx";
import {SignalRClient} from "./services/SignalRClient.ts";

const signalRClient = new SignalRClient(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_JOBS_URI_SIGNALR);

function App() {
    return (
        <AuthProvider>
            <SignalRProvider client={signalRClient}>
                <Layout/>
            </SignalRProvider>
        </AuthProvider>
    )
}

export default App;
