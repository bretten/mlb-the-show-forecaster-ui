import './App.css'
import {Layout} from "./components/Layout.tsx";
import {AuthProvider} from "./components/auth/AuthProvider.tsx";
import {SignalRProvider} from "./components/signalr/SignalRProvider.tsx";

function App() {
    return (
        <AuthProvider>
            <SignalRProvider>
                <Layout/>
            </SignalRProvider>
        </AuthProvider>
    )
}

export default App;
